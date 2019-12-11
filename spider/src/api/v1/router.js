const betMatches = require("./user/bet-matches");
/* eslint-disable no-constant-condition */
/* eslint-disable operator-linebreak */
/* eslint-disable max-len */
/* eslint-disable function-paren-newline */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-shadow */
/* eslint-disable no-trailing-spaces */
/* eslint-disable object-curly-newline */
/* eslint-disable radix */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
/* eslint-disable no-undef */
/* eslint-disable sort-keys */
/* eslint-disable no-return-assign */
/* eslint-disable arrow-parens */
/* eslint-disable quotes */
const devices = require("puppeteer/DeviceDescriptors");
const iPhonex = devices["iPhone X"];

const moment = require("moment");

const BASE_URL = "https://mobile.bet365.com/";
const URL_FRAGMENT = "#/IP/";
const DELAY_BASIC_RAW = 1200;
const DELAY_SLOW_RAW = 2200;

const DELAY_TYPING = 157;

const DELAY_FACTOR = 0.1;

const DELAY_BASIC = DELAY_BASIC_RAW * DELAY_FACTOR;
const DELAY_SLOW = DELAY_SLOW_RAW * DELAY_FACTOR;

const MINIMUM_TIME = 80;

const chalk = require("chalk");
const express = require("express");

const puppeteer = require("puppeteer");

const CircularJSON = require("circular-json");

const router = express.Router();

const loginWithPage = async (page, username, password, ip) => {
  try {
    const pageUrl = await getURL(page);
    if (pageUrl != `${BASE_URL}${URL_FRAGMENT}`) {
      await page.goto(`${BASE_URL}${URL_FRAGMENT}`);
      await page.waitForSelector(".ipo-Fixture");
    }
    const loginButton = await page.$(".hm-LoggedOutButtons_Login");
    if (!loginButton) return true;

    const response = await page.evaluate(
      async (DELAY_TYPING, DELAY_SLOW, DELAY_BASIC, username, password) => {
        function sleep(ms) {
          return new Promise(resolve => {
            setTimeout(resolve, ms);
          });
        }

        const getRandomDelay = (slow, typing) => {
          if (typing) {
            let msVariant = Math.floor(Math.random() * 50);

            const positiveOrNot = Math.floor(Math.random() * 1);

            if (positiveOrNot === 0) {
              msVariant *= -1;
            }

            return DELAY_TYPING + msVariant;
          } else {
            let msVariant = Math.floor(Math.random() * 100);

            const positiveOrNot = Math.floor(Math.random() * 1);

            if (positiveOrNot === 0) {
              msVariant *= -1;
            }

            if (slow && !typing) return DELAY_SLOW + msVariant;

            return DELAY_BASIC + msVariant;
          }
        };

        const typeInput = async (input, word) => {
          for (let i = 0; i < word.length; i++) {
            input.value = `${input.value}${word[i]}`;
            await sleep(getRandomDelay(true, true));
          }

          // return true;
        };

        const loginButton = document.querySelector(
          ".hm-LoggedOutButtons_Login"
        );
        if (!loginButton) {
          return "";
        }
        await sleep(getRandomDelay());
        loginButton.click();

        let found = false;
        for (let attempts = 0; attempts < 12; attempts++) {
          if (!document.querySelector(".lm-StandardLogin_Username")) {
            await sleep(1000);
          } else {
            found = true;
            attempts = 12;
          }
        }
        if (!found) {
          return "[BUG] input not found";
        }
        const emailInput = document.querySelector(".lm-StandardLogin_Username");
        const passwordInput = document.querySelector(
          ".lm-StandardLogin_Password"
        );

        await sleep(getRandomDelay(true));

        emailInput.value = "";
        emailInput.focus();
        await typeInput(emailInput, username);
        await sleep(getRandomDelay());

        await sleep(getRandomDelay(true));
        await typeInput(passwordInput, password);
        await sleep(getRandomDelay(true));
        const okButton = document.querySelector(
          ".lm-StandardLogin_LoginButton"
        );
        okButton.click();
      },
      DELAY_TYPING,
      DELAY_SLOW,
      DELAY_BASIC,
      username,
      password
    );
    try {
      if (loginResponse.includes("[BUG]")) {
        console.log(chalk.red(response));
        return false;
      }
    } catch {}

    return true;
  } catch {
    console.log(chalk.red(`The ip ${ip} is no longer valid`));
  }
};

const getBetsCountFromPage = async page => {
  await page.waitForSelector(".hm-LoggedInButtons_MyBetsLabel");

  const count = await page.evaluate(async () => {
    function sleep(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }

    for (let attempts = 0; attempts < 5; attempts++) {
      const label = document.querySelector(".hm-LoggedInButtons_MyBetsCount");
      if (label) {
        const count = label.innerHTML;
        return count;
      } else {
        console.log("attempt " + attempts);
        await sleep(1000);
      }
    }
    return 0;
  });
  let countInt = parseInt(count);

  return countInt;
};

const makeBetFromPage = async (match, maxOdd, valueToBet, page) => {
  try {
    await page.goto(match.url);
    await page.waitForSelector(".ipe-EventViewMarketTabs");
  } catch {
    return false;
  }
  const result = await page.evaluate(
    async (match, maxOdd, valueToBet) => {
      let oddsValue = 0;
      function sleep(ms) {
        return new Promise(resolve => {
          setTimeout(resolve, ms);
        });
      }

      const enterValue = async value => {
        const valueStr = value.toString();
        for (let i = 0; i < valueStr.length; i++) {
          let index = 0;
          if (valueStr[i] == "0") index = 10;
          else if (valueStr[i] == "." || valueStr[i] == ",") index = 9;
          else index = parseInt(valueStr[i]) - 1;

          try {
            document.querySelector(".qb-Keypad").children[index].click();
          } catch {
            return "Keypad not found!";
          }
          await sleep(900);
        }
      };

      await sleep(1000);
      const tabChildren = document.querySelectorAll(
        ".ipe-EventViewTabLink + div:not(.Hidden)"
      );

      const array = Array.prototype.slice.call(tabChildren);

      const goalsTabTitle = "Goals";
      const goalsTabTitlePT = "Gols";
      if (array.length === 0) {
        return "goals tab not found. BUG!";
      }
      let goalsTab = null;
      for (let i = array.length - 1; i > 0; i -= 1) {
        console.log(array[i].innerHTML);
        if (
          array[i].innerHTML.includes(goalsTabTitle) ||
          array[i].innerHTML.includes(goalsTabTitlePT)
        ) {
          goalsTab = array[i];
          i = 0;
        }
      }
      if (goalsTab) {
        goalsTab.click();
        await sleep(1000);
        const items = document.querySelectorAll(".ipe-Market");
        const children = Array.prototype.slice.call(items);
        for (let k = 0; k < children.length; k += 1) {
          const groupTabTitle =
            children[k].firstElementChild.children[0].innerHTML;
          if (
            groupTabTitle.includes("Match Goals") ||
            (groupTabTitle.includes("Partida") &&
              groupTabTitle.includes("Gols"))
          ) {
            goalsTab = children[k];
            const goalsValues = goalsTab.querySelector(".ipe-MarketContainer");
            const countPossibilitiesChildren =
              goalsValues.lastElementChild.children;
            const countPossibilitiesArray = Array.prototype.slice.call(
              countPossibilitiesChildren
            );
            if (countPossibilitiesArray.length >= 3) {
              const betOdds = goalsValues.lastElementChild.lastElementChild.querySelector(
                ".ipe-Participant_OppOdds"
              ).innerHTML;
              if (oddsValue <= maxOdd) {
                if (!goalsValues.lastElementChild.lastElementChild) {
                  return "Not found odds field. [BUG]!";
                }
                goalsValues.lastElementChild.lastElementChild.click();
                await sleep(1200);
                if (!document.querySelector(".qb-DetailsContainer")) {
                  return "Bet button not found. [BUG]!";
                }
                document.querySelector(".qb-DetailsContainer").click();

                await sleep(1000);
                await enterValue(valueToBet);
                match.odds = betOdds;
                match.value = valueToBet;
                if (!document.querySelector(".qb-PlaceBetButton")) {
                  return "Finish bet button not found. [BUG]!";
                }
                // if (!window.confirm("Do you really want to bet?")) {
                //   return "";
                // }
                document.querySelector(".qb-PlaceBetButton").click();
                await sleep(1000);
                const resultLabel = document.querySelector(
                  ".qb-Header_MainText"
                );

                for (let attempts = 0; attempts < 14; attempts++) {
                  let resultText = resultLabel.innerText;
                  if (
                    resultText.includes("Aposta Feita") ||
                    resultText.includes("Bet Placed")
                  ) {
                    // if (finishLabel) {
                    const finishLabel = document.querySelector(
                      ".qb-Header_Visible"
                    );
                    k = children.length;
                    finishLabel.lastChild.click();
                    await sleep(1000);
                    try {
                      finishLabel.lastChild.click();
                      await sleep(500);
                    } catch {}
                    await sleep(500);
                    // if (window.confirm("Do you want to freeze?")) {
                    //   await sleep(2000);
                    // }
                    return true;
                  } else {
                    await sleep(1000);
                  }
                }

                await false;
              } else {
                return `Match ${match.url} odds is now ${oddsValue} and the limit is ${maxOdd}`;
              }
            }
          }
        }
      } else {
        console.log("Goal panel not found");
      }
    },
    match,
    maxOdd,
    valueToBet
  );

  if (typeof result == typeof "") {
    console.log(chalk.red(result));
    console.log("bug");
    return false;
  }

  return true;
};

const getNewPageByIp = async (browser, ip) => {
  const page = await browser.newPage();
  await page.emulate(iPhonex);
  const options = {
    username: `lum-customer-hl_999dc5f5-zone-static-ip-${ip}`,
    password: "juohlhy66kgb"
  };

  await page.authenticate(options);
  await sleep(500);
  await page.goto(`${BASE_URL}${URL_FRAGMENT}`);
  await page.waitForSelector(".ipo-Fixture");

  return page;
};

class browserManager {
  // ip: string
  // browser
  // pages: {isBusy: boolean, page, id: number}[]
  static browserInstancies = [
    {
      ip: "default",
      browser: null,
      pages: [{ isBusy: false, page: null, id: 0 }]
    }
  ];

  // id: match.id
  // ip
  static betsQueue = [];

  static pageId = 0;

  static getNewPageId() {
    this.pageId++;
    return this.pageId;
  }

  static async closeExcessPage(browserInstance, idPage) {
    const foundBrowser = this.browserInstancies.find(
      item => item.ip === browserInstance.ip
    );
    if (foundBrowser) {
      if (!this.betsQueue.find(item => item.ip === browserInstance.ip)) {
        const foundPage = browserInstance.pages.find(item => item.id == idPage);
        if (foundPage) {
          if (foundPage.id != 0) await foundPage.page.close();
        } else {
          console.log("page not found");
        }
      } else {
        browserInstance.pages[0].isBusy = false;
        const pages = await browserInstance.browser.pages();
        const pagesLength = pages.length;
        for (let i = 2; i < pagesLength; i++) {
          await pages[i].close();
        }
       
      }
    }
  }

  static async createNewPageByBrowserIp(browser, ip, zeroId) {
    console.log(browser ? "createnewpage defined" : "createnewpage undefiend");
    const newPage = await getNewPageByIp(browser, ip);
    const pageInstance = {
      isBusy: true,
      page: newPage,
      id: zeroId ? 0 : this.getNewPageId()
    };
    return pageInstance;
  }
  static async getPageInstanceByBrowserInstance(browserInstance) {
    const { browser, ip } = browserInstance;
    if (browserInstance.pages.length == 0) {
      const pageInstance = await this.createNewPageByBrowserIp(
        browser,
        ip,
        true
      );
      browserInstance.pages.push(pageInstance);
      return pageInstance;
    } else {
      const isRunning = this.betsQueue.find(
        item => item.ip === browserInstance.ip
      );
      if (isRunning) {
        const pageInstance = await this.createNewPageByBrowserIp(
          browser,
          ip
        );
        browserInstance.pages.push(pageInstance);
        return pageInstance;
      } else {
        return browserInstance.pages[0];
      }
    }
  }

  // * @param ip string
  static async getInstanceByIp(ip) {
    const foundBrowser = this.browserInstancies.find(item => item.ip === ip);
    if (foundBrowser) {
      return foundBrowser;
    } else {
      const browser = await launchBrowser(true);
      const newPage = await this.createNewPageByBrowserIp(browser, ip);
      newPage.isBusy = false;
      const pages = [];
      pages.push(newPage);
      const instance = {
        browser,
        pages,
        ip
      };
      this.browserInstancies.push(instance);
      return instance;
    }
  }

  static async makeBets(
    matchesRaw,
    username,
    password,
    ip,
    maxOdd,
    valueToBet,
    limitBets
  ) {
    let successfullyBets = [];
    const browserInstance = await this.getInstanceByIp(ip);
    const { browser } = browserInstance;
    const pageInstance = await browserManager.getPageInstanceByBrowserInstance(
      browserInstance
    );
    const page = pageInstance.page;
    const pId = pageInstance.id;

    const loginResponse = await loginWithPage(page, username, password, ip);

    if (!loginResponse) {
      // CRITICAL
      return [];
    }

    try {
      const countBets = await getBetsCountFromPage(page);

      await sleep(2000);

      // unredundant matches
      const matches = matchesRaw.filter(
        item =>
          !this.betsQueue.some(queue => queue.id == item.id && queue.ip == ip)
      );
      console.log("antes" + matches.length + "depois" + matchesRaw.length);

      for (let index = 0; index < matches.length; index++) {
        if (
          countBets >= limitBets ||
          countBets + successfullyBets.length >= limitBets
        ) {
          console.log(
            "Limit of bets" +
              countBets +
              " / " +
              successfullyBets.length +
              " / " +
              limitBets
          );
          index = matches.length;
        } else {
          const currentMatch = matches[index];
          this.betsQueue.push({ id: currentMatch.id, ip });
          console.log(
            `Updated queue: ${this.betsQueue
              .map(queue => `${queue.id} - ${queue.ip}`)
              .join(", ")}`
          );
          try {
            console.log(
              chalk.blueBright(
                `${username}`
              )`Making bet ${currentMatch.teamA} x ${currentMatch.teamB}, max odds: ${maxOdd}, value: ${valueToBet}`
            );
          } catch {}
          const betResponse = await makeBetFromPage(
            currentMatch,
            maxOdd,
            valueToBet,
            page
          );
          if (betResponse) {
            successfullyBets.push(currentMatch);
          }
          this.betsQueue = this.betsQueue.filter(
            queue => queue.id != currentMatch.id && queue.ip != ip
          );
          console.log(
            `Updated queue: ${this.betsQueue
              .map(queue => `${queue.id} - ${queue.ip}`)
              .join(", ")}`
          );
        }
      }
      await this.closeExcessPage(browserInstance, pId);
      // await browser.close();
      return successfullyBets;
    } catch (e) {
      console.log(chalk.redBright(`An error has occurred. ${e.message}`));
      // await browser.close();
      return successfullyBets;
    }
  }
}

const getRandomDelay = (slow, typing) => {
  if (typing) {
    let msVariant = Math.floor(Math.random() * 50);

    const positiveOrNot = Math.floor(Math.random() * 1);

    if (positiveOrNot === 0) {
      msVariant *= -1;
    }

    return DELAY_TYPING + msVariant;
  } else {
    let msVariant = Math.floor(Math.random() * 100);

    const positiveOrNot = Math.floor(Math.random() * 1);

    if (positiveOrNot === 0) {
      msVariant *= -1;
    }

    if (slow && !typing) return DELAY_SLOW + msVariant;

    return DELAY_BASIC + msVariant;
  }
};

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const goesToMatch = async (id, page) =>
  page.evaluate(async id => {
    function sleep(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }

    const firstElement = document.querySelector(`#${id}`);

    try {
      firstElement.scrollIntoView({ behavior: "smooth" });
      sleep(1500);
      firstElement.click();

      return true;
    } catch {
      return "";
    }
  }, id);

const goBack = async page =>
  page.evaluate(async () => {
    // const button = document.querySelector(".ip-ControlBar_BBarItem");
    const button = document.querySelector(".ipe-EventViewTitle_Back");

    if (button) {
      console.log("Going back...");
      button.click();
    }
  });

const getMatches = async page =>
  page.evaluate(async MINIMUM_TIME => {
    const matchesBlocks = document.querySelectorAll(".ipo-Fixture");

    console.log("found", matchesBlocks);
    const matchesObj = [];
    // eslint-disable-next-line no-unused-vars
    const filterMatches = array =>
      array.filter(item => {
        const timeInt = parseInt(item.time.slice(0, 2));
        // return timeInt >= 80 && (item.lessThan < 1.1 || item.moreThan <= 1.1);
        const shouldReturn = timeInt >= MINIMUM_TIME;
        if (shouldReturn) {
          if (
            item.teamA.toLowerCase().includes("sub") ||
            item.teamA.toLowerCase().includes("U18") ||
            item.teamA.toLowerCase().includes("U19") ||
            item.teamA.toLowerCase().includes("U20") ||
            item.teamA.toLowerCase().includes("U21") ||
            item.teamA.toLowerCase().includes("U22") ||
            item.teamA.toLowerCase().includes("U23") ||
            item.teamA.toLowerCase().includes("women") ||
            item.teamB.toLowerCase().includes("sub") ||
            item.teamB.toLowerCase().includes("women") ||
            item.teamB.toLowerCase().includes("U18") ||
            item.teamB.toLowerCase().includes("U19") ||
            item.teamB.toLowerCase().includes("U20") ||
            item.teamB.toLowerCase().includes("U21") ||
            item.teamB.toLowerCase().includes("U22") ||
            item.teamB.toLowerCase().includes("U23")
          )
            shouldReturn = false;
          console.log(
            `Women/sub match detected: ${item.teamA} x ${item.teamB}`
          );
        }

        return shouldReturn;
      });

    let currentId = 0;

    [].forEach.call(matchesBlocks, item => {
      const teamStackArray = item.querySelectorAll(".ipo-Fixture_Truncator");
      const teamStack = Array.prototype.slice.call(teamStackArray);
      if (!item.querySelector(".ipo-Fixture_Time")) {
      } else {
        const time = item.querySelector(".ipo-Fixture_Time").firstChild
          .innerHTML;
        const team1 = teamStack[0].innerHTML;
        const scoreTeamA = item.querySelectorAll(
          ".ipo-Fixture_CompetitorScores"
        )[0].innerText;
        const scoreTeamB = item.querySelectorAll(
          ".ipo-Fixture_CompetitorScores"
        )[1].innerText;

        const team2 = teamStack[1].innerHTML;
        const boundaries = item.getBoundingClientRect();

        currentId += 1;
        const newId = `id-${currentId}`;

        item.setAttribute("id", newId);
        matchesObj.push({
          id: newId,
          date: new Date(),
          time,
          teamA: team1,
          scoreA: scoreTeamA,
          teamB: team2,
          scoreB: scoreTeamB,
          moreThan: 0,
          lessThan: 0,
          top: boundaries.top
        });
      }
    });
    // console.log(matchesObj);

    filteredMatches = filterMatches(matchesObj);

    await window.setFilteredMatches(filteredMatches);
    await window.setAllMatches(matchesObj);

    return filteredMatches;
  }, MINIMUM_TIME);

const getURL = async page =>
  page.evaluate(async () => {
    const url = window.location.href;
    console.log("url", url);
    return url;
  });

const getOdds = async page =>
  page.evaluate(async () => {
    let oddsValue = 0;
    let moreThan = 0;
    function sleep(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }

    let returnValue = false;
    const tabChildren = document.querySelectorAll(
      ".ipe-EventViewTabLink + div:not(.Hidden)"
    );

    console.log("tabs: ", tabChildren);
    const array = Array.prototype.slice.call(tabChildren);

    const goalsTabTitle = "Doelpunten";
    let goalsTab = null;
    for (let i = array.length - 1; i > 0; i -= 1) {
      console.log(array[i].innerHTML);
      if (array[i].innerHTML.includes(goalsTabTitle)) {
        goalsTab = array[i];
        i = 0;
      }
    }
    if (goalsTab) {
      goalsTab.click();
      await sleep(1000);
      const items = document.querySelectorAll(".ipe-Market");
      const children = Array.prototype.slice.call(items);
      for (let k = 0; k < children.length; k += 1) {
        const groupTabTitle =
          children[k].firstElementChild.children[0].innerHTML;
        if (groupTabTitle.includes("wedstrijd")) {
          goalsTab = children[k];
          const goalsValues = goalsTab.querySelector(".ipe-MarketContainer");
          const countPossibilitiesChildren =
            goalsValues.lastElementChild.children;
          const countPossibilitiesArray = Array.prototype.slice.call(
            countPossibilitiesChildren
          );
          if (countPossibilitiesArray.length >= 3) {
            oddsValue = parseFloat(
              goalsValues.lastElementChild.lastElementChild.querySelector(
                ".ipe-Participant_OppOdds"
              ).innerHTML
            );

            const moreThanStr = goalsValues.firstElementChild.lastElementChild.querySelector(
              ".ipe-Participant_OppName"
            ).innerHTML;

            try {
              moreThan = parseFloat(moreThanStr);
            } catch {}

            try {
              oddsValue = parseFloat(betOdds);
            } catch {}

            console.log("Found odds", oddsValue, goalsTab);
            // alert(`Odds: ${oddsValue}`);

            k = children.length;

            return { odds: oddsValue, moreThan: moreThan };
          }
        }
      }
    }
    return undefined;
  });

const setIds = async (page, previousMatches) =>
  page.evaluate(async previousMatches => {
    // const matchesBlocks = document.querySelectorAll(".ipo-Fixture_TableRow");
    const matchesBlocks = document.querySelectorAll(".ipo-Fixture");
    const matchesBlocksArray = Array.prototype.slice.call(matchesBlocks);
    // console.log("found", matches);
    const matchesObj = [];
    // eslint-disable-next-line no-unused-vars
    function sleep(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }
    for (let i = 0; i < matchesBlocksArray.length; i++) {
      const item = matchesBlocksArray[i];
      const teamStackArray = item.querySelectorAll(".ipo-Fixture_Truncator");
      const teamStack = Array.prototype.slice.call(teamStackArray);
      const time = item.querySelector(".ipo-Fixture_Time").firstChild.innerHTML;
      const team1 = teamStack[0].innerHTML;
      const team2 = teamStack[1].innerHTML;
      let moreThan = 0;

      let lessThan = 0;
      matchesObj.push({
        element: item,
        time,
        teamA: team1,
        scoreA: 0,
        teamB: team2,
        scoreB: 0,
        moreThan,
        lessThan
      });
    }
    // console.log(matchesObj);

    previousMatches.forEach(item => {
      const foundMatch = matchesObj.find(item2 => {
        console.log(item.teamA, item2.teamA);
        return item2.teamA.includes(item.teamA);
      });

      if (foundMatch) {
        foundMatch.element.setAttribute("id", item.id);
      } else {
        console.log("Match no longer exists");
      }
    });

    return true;
  }, previousMatches);

const launchBrowser = async auth => {
  if (auth) {
    return await puppeteer.launch({
      headless: false,
      devtools: true,
      // args: ["--lang=en-US"],
      args: ["--proxy-server=zproxy.lum-superproxy.io:22225", "--lang=en-US,en"]
    });
  } else
    return await puppeteer.launch({
      headless: false,
      devtools: true
      // args: ["--lang=en-US"]
      // args: ["--proxy-server=zproxy.lum-superproxy.io:22225"]
    });
};

const getStatistics = async page =>
  await page.evaluate(async () => {
    let attacksA = 0;
    let attacksB = 0;
    let dangerousAttackA = 0;
    let dangerousAttackB = 0;
    let cornerKickA = 0;
    let cornerKickB = 0;
    let redCardA = 0;
    let redCardB = 0;
    let yellowCardA = 0;
    let yellowCardB = 0;
    let onTargetA = 0;
    let onTargetB = 0;
    let offTargetA = 0;
    let offTargetB = 0;
    let possessionA = 0;
    let possessionB = 0;

    const invalidValue = -1;

    try {
      attacksA = document.querySelector(
        ".ml1-StatsWheel:nth-child(1) .ml1-StatsWheel_Team1Text"
      ).innerText;
    } catch {
      attacksA = invalidValue;
    }
    try {
      attacksB = document.querySelector(
        ".ml1-StatsWheel:nth-child(1) .ml1-StatsWheel_Team2Text"
      ).innerText;
    } catch {
      attacksB = invalidValue;
    }
    try {
      dangerousAttackA = document.querySelector(
        ".ml1-StatsWheel:nth-child(2) .ml1-StatsWheel_Team1Text"
      ).innerText;
    } catch {
      dangerousAttackA = invalidValue;
    }
    try {
      dangerousAttackB = document.querySelector(
        ".ml1-StatsWheel:nth-child(2) .ml1-StatsWheel_Team2Text"
      ).innerText;
    } catch {
      dangerousAttackB = invalidValue;
    }

    try {
      possessionA = document.querySelector(
        ".ml1-StatsWheel:nth-child(3) .ml1-StatsWheel_Team1Text"
      ).innerText;
    } catch {
      possessionA = invalidValue;
    }

    try {
      possessionB = document.querySelector(
        ".ml1-StatsWheel:nth-child(3) .ml1-StatsWheel_Team2Text"
      ).innerText;
    } catch {
      possessionB = invalidValue;
    }

    try {
      cornerKickA = document.querySelectorAll(".ml1-StatsColumn_MiniValue")[0]
        .innerText;
    } catch {
      cornerKickA = invalidValue;
    }

    try {
      redCardA = document.querySelectorAll(".ml1-StatsColumn_MiniValue")[1]
        .innerText;
    } catch {
      attacksA = invalidValue;
    }
    try {
      yellowCardA = document.querySelectorAll(".ml1-StatsColumn_MiniValue")[2]
        .innerText;
    } catch {
      yellowCardA = invalidValue;
    }
    try {
      cornerKickB = document.querySelectorAll(".ml1-StatsColumn_MiniValue")[3]
        .innerText;
    } catch {
      cornerKickB = invalidValue;
    }
    try {
      redCardB = document.querySelectorAll(".ml1-StatsColumn_MiniValue")[4]
        .innerText;
    } catch {
      redCardB = invalidValue;
    }
    try {
      yellowCardB = document.querySelectorAll(".ml1-StatsColumn_MiniValue")[5]
        .innerText;
    } catch {
      yellowCardB = invalidValue;
    }
    const onTargetWrapper = document.querySelector(
      ".ml1-StatsLower_MiniBarWrapper:nth-child(1)"
    );
    try {
      onTargetA = onTargetWrapper.querySelector(".ml1-StatsBar_MiniBar")
        .children[0].innerText;
    } catch {
      onTargetA = invalidValue;
    }

    try {
      onTargetB = onTargetWrapper.querySelector(".ml1-StatsBar_MiniBar")
        .children[2].innerText;
    } catch {
      onTargetB = invalidValue;
    }

    const offTargetWrapper = document.querySelector(
      ".ml1-StatsLower_MiniBarWrapper:nth-child(2)"
    );
    try {
      offTargetA = offTargetWrapper.querySelector(".ml1-StatsBar_MiniBar")
        .children[0].innerText;
    } catch {
      offTargetA = invalidValue;
    }
    try {
      offTargetB = offTargetWrapper.querySelector(".ml1-StatsBar_MiniBar")
        .children[2].innerText;
    } catch {
      offTargetB = invalidValue;
    }

    return {
      attacksA,
      attacksB,
      dangerousAttackA,
      dangerousAttackB,
      cornerKickA,
      cornerKickB,
      redCardA,
      redCardB,
      yellowCardA,
      yellowCardB,
      onTargetA,
      onTargetB,
      offTargetA,
      offTargetB,
      possessionA,
      possessionB
    };
  });

const fetchMatches = async () => {
  const browser = await launchBrowser();
  let allMatches = [];

  let nextMinute = 0;

  let filteredMatches = [];

  let timeout = 0;

  const timeStart = new Date();
  const fetch = async () => {
    const page = await browser.newPage();
    await page.emulate(iPhonex);
    // await page.authenticate({
    //   // username: "lum-customer-hl_999dc5f5-zone-static_res",
    //   username: "lum-customer-hl_999dc5f5-zone-static",
    //   // username: "lum-customer-hl_999dc5f5-zone-static-country-br",
    //   // password: "s6z6grmdpdyx"
    //   password: "juohlhy66kgb"
    // });

    await page.goto(`${BASE_URL}${URL_FRAGMENT}`);

    // await page.waitForSelector(".ipo-Fixture_TableRow"); //desktop
    await page.waitForSelector(".ipo-Fixture");

    // page.on("console", async msg =>
    //   console[msg._type](
    //     ...(await Promise.all(msg.args().map(arg => arg.jsonValue())))
    //   )
    // );

    // eslint-disable-next-line newline-after-var

    await page.exposeFunction(
      "setFilteredMatches",
      array => (filteredMatches = array)
    );

    await page.exposeFunction("setAllMatches", array => (allMatches = array));

    let matches = await getMatches(page);

    console.log(
      chalk.greenBright(`\nFound ${matches.length} possible matches.`)
    );

    for (let i = 0; i < matches.length; i += 1) {
      // let delay = getRandomDelay(false);

      // console.log(`Going to match #${matches[i].id} in ${delay / 1000}s`);

      console.log(
        chalk.blue(
          `${matches[i].time} ${matches[i].teamA} ${matches[i].scoreA} x ${matches[i].scoreB} ${matches[i].teamB}`
        )
      );
      // await sleep(delay);
      const foundMatch = await goesToMatch(matches[i].id, page);

      delay = getRandomDelay();
      if (foundMatch) {
        console.log(chalk.white.dim(`Looking for goals tab...`));
        // await sleep(delay);

        // await page.waitForSelector(".ipe-EventViewTabLink");
        await page.waitForSelector(".ml1-HintsManager");
        const odds = await getOdds(page);
        const URL = await getURL(page);

        if (odds !== undefined && odds != null) {
          matches[i].odds = odds.odds;
          matches[i].moreThan = odds.moreThan;
          await sleep(600);
          try {
            const statistics = await getStatistics(page);
            const {
              attacksA,
              attacksB,
              dangerousAttackA,
              dangerousAttackB,
              cornerKickA,
              cornerKickB,
              redCardA,
              redCardB,
              yellowCardA,
              yellowCardB,
              onTargetA,
              onTargetB,
              offTargetA,
              offTargetB,
              possessionA,
              possessionB
            } = statistics;
            matches[i].attacksA = attacksA;
            matches[i].attacksB = attacksB;
            matches[i].dangerousAttackA = dangerousAttackA;
            matches[i].dangerousAttackB = dangerousAttackB;
            matches[i].cornerKickA = cornerKickA;
            matches[i].cornerKickB = cornerKickB;
            matches[i].redCardA = redCardA;
            matches[i].redCardB = redCardB;
            matches[i].yellowCardA = yellowCardA;
            matches[i].yellowCardB = yellowCardB;
            matches[i].onTargetA = onTargetA;
            matches[i].onTargetB = onTargetB;
            matches[i].offTargetA = offTargetA;
            matches[i].offTargetB = offTargetB;
            matches[i].possessionA = possessionA;
            matches[i].possessionB = possessionB;
          } catch (e) {
            console.log(e.message);
            await sleep(400000);
          }
          console.log(
            chalk.green.dim(`Odds: ${odds.odds}. More Than ${odds.moreThan}.`)
          );
        } else {
          console.log(chalk.red.dim(`No valid bet found.`));
          matches[i].odds = 0;
          matches[i].moreThan = 0;
        }
        matches[i].url = URL;

        delay = getRandomDelay();
      } else {
        console.log(
          chalk.red(`Match no longer exists. Going back in ${delay / 1000}s...`)
        );
      }
      await sleep(delay);
      await goBack(page);
      delay = getRandomDelay(false);

      console.log(
        chalk.white.dim(
          `On main page. Getting all ids again in ${delay / 1000}s...`
        )
      );
      await page.waitForSelector(".ipo-Fixture");
      await setIds(page, matches);
    }

    const nextMatches = allMatches
      .map(item => {
        const timeInt = parseInt(item.time.slice(0, 2));

        return timeInt;
      })
      .filter(timeInt => timeInt < MINIMUM_TIME)
      .map(item => MINIMUM_TIME - item)
      .sort((a, b) => a - b);

    // console.log("times", nextMatches.join(", "));
    // eslint-disable-next-line prefer-destructuring
    nextMinute = nextMatches[0];

    timeout = nextMinute * 60000;

    // console.log(chalk.yellowBright(`Next minute: ${nextMinute}`));

    filteredMatches = matches;
    const diffTime = new Date().getTime() - timeStart.getTime();
    const diffTimeFormated = moment.duration(diffTime).asSeconds();
    console.log(`Query duration: ${diffTimeFormated} seconds`);
    console.log(
      chalk.greenBright(
        `${matches.filter(item => item.odds > 0).length}/${
          matches.length
        } valid matches. Next match in ${nextMinute} minutes`
      )
    );
  };

  try {
    await fetch();
  } catch (e) {
    console.log(e.message);
    nextMinute = 30;
  } finally {
    await browser.close();
  }
  return { matches: filteredMatches, nextMinute };
};

const typeInput = async (input, word) => {
  for (let i = 0; i < word.length; i++) {
    emailInput.value = `${input.value}${word[i]}`;
    await sleep(getRandomDelay(true, true));
  }

  return true;
};

router.use("/match", async (req, res) => {
  const data = await fetchMatches();
  const filteredMatches = data.matches.filter(item => {
    let oddInt = 0;
    try {
      oddInt = parseFloat(item.odds);
    } catch {}
    return oddInt >= 1;
  });
  res.send({ matches: filteredMatches, nextMinute: data.nextMinute });
});

router.post("/check", async (req, res) => {
  const browser = await launchBrowser(false);
  try {
    const { matches } = req.body;

    let finishedMatches = [];
    let unfinishedMatches = [];

    const checkMatch = async match => {
      const page = await browser.newPage();
      await page.emulate(iPhonex);

      await page.exposeFunction("pushFinishedMatch", match =>
        finishedMatches.push(match)
      );
      await page.exposeFunction("pushUninishedMatch", match =>
        unfinishedMatches.push(match)
      );
      await page.goto(match.url);
      await page.waitForSelector(".hm-HeaderModule");

      await sleep(2000);
      await page.evaluate(async match => {
        const finishedLabel = document.querySelector(".ml1-Anims_H2Text");
        const matchBlock = document.querySelector(".ipo-Fixture_GameDetail");
        // if (finishedLabel) {
        //   if (finishedLabel.innerHTML.toLowerCase().includes("eind"));
        //   await window.pushFinishedMatch(match);
        // } else {
        //   if (!!matchBlock) await window.pushFinishedMatch(match);
        // }
        if (match.url != window.location.href) {
          await window.pushFinishedMatch(match);
        } else {
          await window.pushUninishedMatch(match);
        }
        console.log(window.location.href);
        console.log(match.url);
        console.log(finishedLabel);
        console.log(matchBlock);
        return true;
      }, match);

      // await page.close();
    };
    const promises = [];
    matches.forEach(item => {
      promises.push(checkMatch(item));
    });
    await Promise.all(promises);
  } catch {
    await browser.close();
  }
  res.send({ finishedMatches, unfinishedMatches });
});

router.use("/open/:ip", async (req, res) => {
  try {
    const ip = req.params.ip;
    const ips = req.body.ips;

    const browser = await launchBrowser(true);
    try {
      const page = await browser.newPage();

      await page.emulate(iPhonex);
      const options = {
        username: `lum-customer-hl_999dc5f5-zone-static-ip-${ip}`,
        password: "juohlhy66kgb"
        // password: "s6z6grmdpdyx"
      };

      await page.authenticate(options);
      await page.goto(`${BASE_URL}${URL_FRAGMENT}`);
      await page.waitForSelector(".ipo-Fixture");
    } catch {}
    const promises = [];

    const loadPageByIp = async ipParameter => {
      const newPage = await browser.newPage();

      await newPage.emulate(iPhonex);
      const newOptions = {
        username: `lum-customer-hl_999dc5f5-zone-static-ip-${ipParameter}`,
        password: "juohlhy66kgb"
        // password: "s6z6grmdpdyx"
      };

      await newPage.authenticate(newOptions);
      await newPage.goto(`${BASE_URL}${URL_FRAGMENT}`);
      await newPage.evaluate(ipParameter => {
        console.log(ipParameter);
      }, ipParameter);
    };
    if (ips) {
      ips.forEach(item => {
        promises.push(loadPageByIp(item));
      });
      await Promise.all(promises);
    }
  } catch (e) {
    console.log(e.message);
    // await browser.close();
  }

  res.status(200).send();
});

router.use("/bet/match", async (req, res) => {
  // browserManager;
  const { username, password } = req.body.user;
  const { matches, maxOdd, valueToBet, limitBets, ip } = req.body;

  const successfullyBets = await browserManager.makeBets(
    matches,
    username,
    password,
    ip,
    maxOdd,
    valueToBet,
    limitBets
  );
  res.status(200).send(successfullyBets);
});

router.use("/health", async (req, res) => {
  res.status(200).send();
});

router.use("/getresults", async (req, res) => {
  const browser = await launchBrowser(true);
  try {
    const { username, password, ip, limit } = req.body;

    const promises = [];

    const results = [];

    const page = await browser.newPage();
    await page.emulate(iPhonex);

    const options = {
      username: `lum-customer-hl_999dc5f5-zone-static-ip-${ip}`,
      password: "juohlhy66kgb"
    };

    await page.authenticate(options);
    await sleep(1000);
    await page.goto(`${BASE_URL}${URL_FRAGMENT}`);

    await page.waitForSelector(".ipo-Fixture");

    let bets = [];
    await page.exposeFunction("setBets", a => (bets = a));

    const bugLogin = await page.evaluate(
      async (DELAY_TYPING, DELAY_SLOW, DELAY_BASIC, username, password) => {
        function sleep(ms) {
          return new Promise(resolve => {
            setTimeout(resolve, ms);
          });
        }

        const getRandomDelay = (slow, typing) => {
          if (typing) {
            let msVariant = Math.floor(Math.random() * 50);

            const positiveOrNot = Math.floor(Math.random() * 1);

            if (positiveOrNot === 0) {
              msVariant *= -1;
            }

            return DELAY_TYPING + msVariant;
          } else {
            let msVariant = Math.floor(Math.random() * 100);

            const positiveOrNot = Math.floor(Math.random() * 1);

            if (positiveOrNot === 0) {
              msVariant *= -1;
            }

            if (slow && !typing) return DELAY_SLOW + msVariant;

            return DELAY_BASIC + msVariant;
          }
        };

        const typeInput = async (input, word) => {
          for (let i = 0; i < word.length; i++) {
            input.value = `${input.value}${word[i]}`;
            await sleep(getRandomDelay(true, true));
          }

          return true;
        };

        const loginButton = document.querySelector(
          ".hm-LoggedOutButtons_Login"
        );

        await sleep(getRandomDelay());
        loginButton.click();

        let found = false;
        for (let attempts = 0; attempts < 12; attempts++) {
          if (!document.querySelector(".lm-StandardLogin_Username")) {
            await sleep(1000);
          } else {
            found = true;
            attempts = 12;
          }
        }
        if (!found) {
          return "input not found. BUG";
        }
        const emailInput = document.querySelector(".lm-StandardLogin_Username");
        const passwordInput = document.querySelector(
          ".lm-StandardLogin_Password"
        );

        await sleep(getRandomDelay(true));

        emailInput.value = "";
        emailInput.focus();
        await typeInput(emailInput, username);
        await sleep(getRandomDelay());

        await sleep(getRandomDelay(true));
        await typeInput(passwordInput, password);
        await sleep(getRandomDelay(true));
        const okButton = document.querySelector(
          ".lm-StandardLogin_LoginButton"
        );
        okButton.click();
      },
      DELAY_TYPING,
      DELAY_SLOW,
      DELAY_BASIC,
      username,
      password
    );
    if (bugLogin) {
      console.log(chalk.red(bug));
    }
    await sleep(3000);
    await page.goto("https://mobile.bet365.com/#/MB/");

    await page.waitForSelector(".myb-MyBetsHeader_Container");
    await sleep(500);
    await page.evaluate(async limit => {
      function sleep(ms) {
        return new Promise(resolve => {
          setTimeout(resolve, ms);
        });
      }
      document.querySelector(".myb-MyBetsHeader_Container").children[3].click();
      await sleep(500);
      const betsArray = document.querySelectorAll(".myb-SettledBetItemHeader");
      const length = betsArray.length;
      const bets = [];
      const limitInt = parseInt(limit);
      const max = length > limitInt ? limitInt : length;
      if (max === 0) await sleep(1000000);
      for (let i = 0; i < max; i++) {
        await sleep(300);
        betsArray[i].click();
        const teams = betsArray[i].parentElement
          .querySelector(".myb-SettledBetParticipant_FixtureDescription")
          .innerText.split(" v ");
        await sleep(100);
        const teamA = teams[0];
        const teamB = teams[1];
        const returnValue = betsArray[i].parentElement
          .querySelector(".myb-SettledBetItemFooter_ReturnText")
          .innerText.replace("R$", "")
          .replace(",", ".");
        const resultLabel = betsArray[i].querySelector(
          ".myb-SettledBetItem_BetStateLabel"
        ).innerText;
        console.log(betsArray[i]);
        const win =
          !resultLabel.toLowerCase().includes("perdida") &&
          !resultLabel.toLowerCase().includes("lost");
        bets.push({
          teamA,
          teamB,
          returnValue,
          win
        });
      }
      await window.setBets(bets);

      return;
    }, limit);

    await browser.close();
    res.send({ results: bets });
  } catch (e) {
    console.log(chalk.redBright(`An error has occurred. ${e.message}`));
    await browser.close();
    res.send({ results: [] });
  }
});

router.use("/ip/:ip", async (req, res) => {
  const browser = await launchBrowser(true);
  try {
    const ip = req.params.ip;
    const page = await browser.newPage();
    const ips = req.body.ips;
    // if (ip) {
    //   const options = {
    //     username: `lum-customer-hl_999dc5f5-zone-static-ip-${ip}`,
    //     password: "juohlhy66kgb"
    //   };
    //   await page.authenticate(options);
    //   await page.goto(`${BASE_URL}${URL_FRAGMENT}`);
    //   await page.waitForSelector(".ipo-Fixture");
    //   await sleep(1000);
    // }
    console.log(ips);
    if (ips) {
      for (let i = 0; i < 10; i++) {
        try {
          const item = ips[i];
          // const proxies = [
          // "lum-customer-hl_999dc5f5-zone-static_res-ip-161.123.147.48",
          // "lum-customer-hl_999dc5f5-zone-static_res-ip-161.123.144.175",
          // "lum-customer-hl_999dc5f5-zone-static_res-ip-2.57.250.68",
          // "lum-customer-hl_999dc5f5-zone-static_res-ip-2.57.251.171",
          // "lum-customer-hl_999dc5f5-zone-static_res-ip-45.132.131.7",
          // "lum-customer-hl_999dc5f5-zone-static_res-ip-64.79.242.133",
          // "lum-customer-hl_999dc5f5-zone-static_res-ip-92.119.25.2",
          // "lum-customer-hl_999dc5f5-zone-static_res-ip-154.3.25.140",
          // "lum-customer-hl_999dc5f5-zone-static_res-ip-161.123.144.191",
          // "lum-customer-hl_999dc5f5-zone-static_res-ip-2.57.251.128"
          // ];
          const proxies = [
            "lum-customer-hl_999dc5f5-zone-static_res-ip-45.130.213.194",
            "lum-customer-hl_999dc5f5-zone-static_res-ip-45.132.176.89",
            "lum-customer-hl_999dc5f5-zone-static_res-ip-45.132.36.199",
            "lum-customer-hl_999dc5f5-zone-static_res-ip-45.129.129.199",
            "lum-customer-hl_999dc5f5-zone-static_res-ip-45.132.37.190",
            "lum-customer-hl_999dc5f5-zone-static_res-ip-45.131.161.151",
            "lum-customer-hl_999dc5f5-zone-static_res-ip-45.132.177.57",
            "lum-customer-hl_999dc5f5-zone-static_res-ip-45.129.128.253",
            "lum-customer-hl_999dc5f5-zone-static_res-ip-45.131.160.249",
            "lum-customer-hl_999dc5f5-zone-static_res-ip-185.81.144.146"
          ];

          const newOptions = {
            username: proxies[i],
            // password: "juohlhy66kgb"
            password: "s6z6grmdpdyx"
          };

          //background-color:#585858;
          const newPage = await browser.newPage();
          await newPage.authenticate(newOptions);
          await newPage.goto(`${BASE_URL}${URL_FRAGMENT}`);
          await newPage.evaluate(item => {
            console.log(item);
            try {
              console.log(document.querySelector("body").style.backgroundColor);
            } catch {}
          }, item);
          await sleep(4000);
        } catch {}
      }
    }
  } catch (e) {
    await browser.close();
  }

  res.status(200).send();
});

module.exports = router;
