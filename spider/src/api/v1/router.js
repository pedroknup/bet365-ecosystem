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
const DELAY_BASIC_RAW = 1500;
const DELAY_SLOW_RAW = 3000;

const DELAY_TYPING = 357;

const DELAY_FACTOR = 0.2;

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

        return shouldReturn;
      });

    let currentId = 0;

    [].forEach.call(matchesBlocks, item => {
      const teamStackArray = item.querySelectorAll(".ipo-Fixture_Truncator");
      const teamStack = Array.prototype.slice.call(teamStackArray);
      const time = item.querySelector(".ipo-Fixture_Time").firstChild.innerHTML;
      const team1 = teamStack[0].innerHTML;

      // const mainMarkersScore = item.querySelector(".ipo-MainMarkets")
      //   .lastElementChild;
      // const participantCentered = mainMarkersScore.querySelectorAll(
      //   ".gll-ParticipantCentered"
      // );

      let moreThan = 0;

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

            console.log("Found odds", oddsValue, goalsTab);
            // alert(`Odds: ${oddsValue}`);

            k = children.length;

            return oddsValue;
          }
        }
      }
    }
    return oddsValue;
  });

const setIds = async (page, previousMatches) =>
  page.evaluate(async previousMatches => {
    // const matchesBlocks = document.querySelectorAll(".ipo-Fixture_TableRow");
    const matchesBlocks = document.querySelectorAll(".ipo-Fixture");

    // console.log("found", matches);
    const matchesObj = [];
    // eslint-disable-next-line no-unused-vars

    [].forEach.call(matchesBlocks, item => {
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
    });
    // console.log(matchesObj);

    previousMatches.forEach(item => {
      const foundMatch = matchesObj.find(item2 => item2.teamA === item.teamA);

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
      let delay = getRandomDelay(false);

      // console.log(`Going to match #${matches[i].id} in ${delay / 1000}s`);

      console.log(
        chalk.blue(
          `${matches[i].time} ${matches[i].teamA} ${matches[i].scoreA} x ${matches[i].scoreB} ${matches[i].teamB}`
        )
      );
      await sleep(delay);
      const foundMatch = await goesToMatch(matches[i].id, page);

      delay = getRandomDelay(true);
      if (foundMatch) {
        console.log(chalk.white.dim(`Looking for goals tab...`));
        await sleep(delay);
        const odds = await getOdds(page);
        const URL = await getURL(page);
        matches[i].url = URL;

        delay = getRandomDelay();

        matches[i].odds = 0;

        if (odds > 0) {
          matches[i].odds = odds;
          console.log(
            chalk.green.dim(`Odds: ${odds}. Going back in ${delay / 1000}s...`)
          );
        } else {
          console.log(
            chalk.red.dim(
              `No valid bet found. Going back in ${delay / 1000}s... `
            )
          );
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
      await sleep(delay);
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

  await fetch();

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

router.use("/bet/match", async (req, res) => {
  const browser = await launchBrowser(true);
  const page = await browser.newPage();
  const pageLanguage = await browser.newPage();

  await pageLanguage.emulate(iPhonex);
  await page.emulate(iPhonex);
  const ip = req.body.ip;
  console.log(ip);
  const languageURL = "https://mobile.bet365.com/languages.aspx";
  const options = {
    // username: "lum-customer-hl_999dc5f5-zone-static_res",
    // username: "lum-customer-hl_999dc5f5-zone-static",
    // username: "lum-customer-hl_999dc5f5-zone-static_res-country-de",
    // username: "lum-customer-hl_999dc5f5-zone-static-country-de",
    username: `lum-customer-hl_999dc5f5-zone-static-ip-${ip}`,
    // username: `lum-customer-hl_999dc5f5-zone-static-country-br`,
    // password: "s6z6grmdpdyx"
    password: "juohlhy66kgb"
  };
  await page.authenticate(options);
  await sleep(1000);

  await pageLanguage.authenticate(options);

  await pageLanguage.goto(languageURL);

  await pageLanguage.waitForSelector(".menuRow");

  const closed = await pageLanguage.evaluate(async () => {
    function sleep(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }

    const languages = document.querySelector(".menuRow");
    await sleep(250);
    console.log(languages);
    languages.firstElementChild.click();
    return true;
  });

  await pageLanguage.waitForSelector(".hm-HeaderModule");
  await sleep(250);
  await pageLanguage.close();

  await sleep(1000);
  await page.goto(`${BASE_URL}${URL_FRAGMENT}`);

  await page.waitForSelector(".ipo-Fixture");

  // await page.exposeFunction("setFound", hasFound => (found = hasFound));

  // // await page.evaluate(async () => {
  // //   const okButton = document
  // //     .querySelector(".hm-Login")
  // //     .querySelector("button");

  // //   await window.setFound(!!okButton);
  // // });

  // console.log(found);
  // if (!found) {
  //   console.log(chalk.red("IP not valid"));
  //   await browser.close();
  //   res.send(200);
  //   return;
  // }

  // await sleep(3000000);
  await page.evaluate(
    async (DELAY_TYPING, DELAY_SLOW, DELAY_BASIC) => {
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

      const loginButton = document.querySelector(".hm-LoggedOutButtons_Login");

      await sleep(getRandomDelay());
      loginButton.click();

      const emailInput = document.querySelector(".lm-StandardLogin_Username");
      const passwordInput = document.querySelector(
        ".lm-StandardLogin_Password"
      );

      await sleep(getRandomDelay(true));
      const email = "phknup";
      const password = "12012012Pk";
      emailInput.value = "";
      emailInput.focus();
      await typeInput(emailInput, email);
      await sleep(getRandomDelay());

      await sleep(getRandomDelay(true));
      await typeInput(passwordInput, password);
      await sleep(getRandomDelay(true));
      const okButton = document.querySelector(".lm-StandardLogin_LoginButton");
      okButton.click();

      return true;
    },
    DELAY_TYPING,
    DELAY_SLOW,
    DELAY_BASIC
  );
  await sleep(getRandomDelay(true));
  await page.goto("https://mobile.bet365.com/#/IP/EV15449561382C1/");
  await sleep(30000);
  await browser.close();

  res.send("OK :D");
});

router.use("/health", async (req, res) => {
  res.status(200).send();
});

module.exports = router;
