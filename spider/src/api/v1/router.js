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

const BASE_URL = "https://www.bet365.com/";
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

        // const mainMarkersScore = item.querySelector(".ipo-MainMarkets")
        //   .lastElementChild;
        // const participantCentered = mainMarkersScore.querySelectorAll(
        //   ".gll-ParticipantCentered"
        // );

        // let lessThan = 0;

        // if (participantCentered.length > 0) {
        //   moreThan = participantCentered[0].querySelector(
        //     ".gll-ParticipantCentered_Odds"
        //   ).innerHTML;

        //   lessThan = participantCentered[1].querySelector(
        //     ".gll-ParticipantCentered_Odds"
        //   ).innerHTML;
        // }

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
          scoreA: 0,
          teamB: team2,
          scoreB: 0,
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

const fetchMatches = async () => {
  let allMatches = [];

  let nextMinute = 0;

  let filteredMatches = [];

  let timeout = 0;

  const timeStart = new Date();
  const fetch = async () => {
    const browser = await launchBrowser();
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

        await page.waitForSelector(".ipe-EventViewTabLink");
        const odds = await getOdds(page);
        const URL = await getURL(page);
        matches[i].url = URL;

        delay = getRandomDelay();

        matches[i].odds = 0;
        matches[i].moreThan = 0;

        if (odds !== undefined && odds != null) {
          matches[i].odds = odds.odds;
          matches[i].moreThan = odds.moreThan;
          console.log(
            chalk.green.dim(`Odds: ${odds.odds}. More Than ${odds.moreThan}.`)
          );
        } else {
          console.log(chalk.red.dim(`No valid bet found.`));
        }
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
    await browser.close();
  };

  try {
    await fetch();
  } catch {
    nextMinute = 2;
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
  const matches = await fetchMatches();

  res.send(matches);
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
  const browser = await launchBrowser(true);
  try {
    const page = await browser.newPage();
    // const pageLanguage = await browser.newPage();

    // await pageLanguage.emulate(iPhonex);
    await page.emulate(iPhonex);
    const ip = req.body.ip;
    console.log(req.body);
    const { username, password } = req.body.user;
    const { matches, maxOdd, valueToBet, limitBets } = req.body;
    const options = {
      username: `lum-customer-hl_999dc5f5-zone-static-ip-${ip}`,
      password: "juohlhy66kgb"
    };

    await page.authenticate(options);
    await sleep(1000);
    await page.goto(`${BASE_URL}${URL_FRAGMENT}`);

    await page.waitForSelector(".ipo-Fixture");

    let successfullyBets = [];
    await page.exposeFunction("pushSuccessfullyBet", a =>
      successfullyBets.push(a)
    );

    const bug = await page.evaluate(
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
    if (bug) {
      console.log(chalk.red(bug));
      res.status(200).send();
      return;
    }
    await page.waitForSelector(".hm-LoggedInButtons_MyBetsLabel");

    const count = await page.evaluate(async () => {
      function sleep(ms) {
        return new Promise(resolve => {
          setTimeout(resolve, ms);
        });
      }

      let found = false;
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
    await sleep(2000);
    for (let index = 0; index < matches.length; index++) {
      if (
        countInt >= limitBets ||
        countInt + successfullyBets.length >= limitBets
      ) {
        console.log(
          "Limit of bets" +
            countInt +
            " / " +
            successfullyBets.length +
            " / " +
            limitBets
        );
        index = matches.length;
      } else {
        const currentMatch = matches[index];
        try {
          console.log(
            chalk.blueBright(
              `${username}`
            )`Making bet ${currentMatch.teamA} x ${currentMatch.teamB}, max odds: ${maxOdd}, value: ${valueToBet}`
          );
        } catch {}
        try {
          await page.goto(currentMatch.url);
          await page.waitForSelector(".ipe-EventViewMarketTabs");

          const resultStr = await page.evaluate(
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
                    document
                      .querySelector(".qb-Keypad")
                      .children[index].click();
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
                  // console.log("found tab");
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
                    const goalsValues = goalsTab.querySelector(
                      ".ipe-MarketContainer"
                    );
                    const countPossibilitiesChildren =
                      goalsValues.lastElementChild.children;
                    const countPossibilitiesArray = Array.prototype.slice.call(
                      countPossibilitiesChildren
                    );
                    if (countPossibilitiesArray.length >= 3) {
                      const betOdds = goalsValues.lastElementChild.lastElementChild.querySelector(
                        ".ipe-Participant_OppOdds"
                      ).innerHTML;
                      // const moreThanStr = goalsValues.firstElementChild.lastElementChild.querySelector(
                      //   ".ipe-Participant_OppName"
                      // ).innerHTML;
                      // let moreThan = 0;
                      // try {
                      //   moreThan = parseFloat(moreThanStr);
                      // } catch {}

                      // try {
                      //   oddsValue = parseFloat(betOdds);
                      // } catch {}

                      // if (moreThan > 4) {
                      //   return `More Than invalid ${moreThan}`;
                      // }
                      console.log("odds:", oddsValue);
                      if (oddsValue <= maxOdd) {
                        if (!goalsValues.lastElementChild.lastElementChild) {
                          return "Not found odds field. BUG!";
                        }
                        goalsValues.lastElementChild.lastElementChild.click();
                        await sleep(1200);
                        if (!document.querySelector(".qb-DetailsContainer")) {
                          return "Bet button not found. BUG!";
                        }
                        document.querySelector(".qb-DetailsContainer").click();

                        await sleep(1000);
                        await enterValue(valueToBet);
                        console.log("ready to bet...");
                        match.odds = betOdds;
                        match.value = valueToBet;
                        if (!document.querySelector(".qb-PlaceBetButton")) {
                          return "Finish bet button not found. BUG!";
                        }
                        // if (!window.confirm("Do you really want to bet?")) {
                        //   return "";
                        // }
                        document.querySelector(".qb-PlaceBetButton").click();
                        await sleep(1000);
                        for (let attempts = 0; attempts < 10; attempts++) {
                          const finishLabel = document.querySelector(
                            ".qb-Header_Visible"
                          );
                          if (finishLabel) {
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
                            await window.pushSuccessfullyBet(match);
                            return "";
                          } else {
                            await sleep(1000);
                          }
                        }
                        await sleep(1000);
                        await window.pushSuccessfullyBet(match);
                        return "";
                      } else {
                        return `Match ${match.url} odds is now ${oddsValue} and the limit is ${maxOdd}`;
                      }
                      k = children.length;
                    }
                  }
                }
              } else {
                console.log("Goal panel not found");
              }
            },
            currentMatch,
            maxOdd,
            valueToBet
          );
          if (resultStr) {
            console.log(chalk.redBright(resultStr));
          } else {
            // successfullyBets.push(currentMatch);
          }
        } catch (e) {
          console.log(chalk.redBright(e.message));
          throw e;
        }
      }
    }
    await browser.close();
    res.send({ successfullyBets, count: count + successfullyBets.length });
  } catch (e) {
    console.log(chalk.redBright(`An error has occurred. ${e.message}`));
    await browser.close();
    res.send({ successfullyBets: [] });
  }
});

router.use("/health", async (req, res) => {
  res.status(200).send();
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
