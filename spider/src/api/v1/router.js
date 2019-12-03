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

const moment = require("moment");

const DELAY_BASIC_RAW = 1500;
const DELAY_SLOW_RAW = 3000;

const DELAY_FACTOR = 0.2;

const DELAY_BASIC = DELAY_BASIC_RAW * DELAY_FACTOR;
const DELAY_SLOW = DELAY_SLOW_RAW * DELAY_FACTOR;

const MINIMUM_TIME = 80;

const chalk = require("chalk");
const express = require("express");

const puppeteer = require("puppeteer");

const CircularJSON = require("circular-json");

const router = express.Router();

const getRandomDelay = slow => {
  let msVariant = Math.floor(Math.random() * 100);

  const positiveOrNot = Math.floor(Math.random() * 1);

  if (positiveOrNot === 0) {
    msVariant *= -1;
  }

  if (slow) return DELAY_SLOW + msVariant;

  return DELAY_BASIC + msVariant;
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
      return false;
    }
  }, id);

const goBack = async page =>
  page.evaluate(async () => {
    const button = document.querySelector(".ip-ControlBar_BBarItem");

    if (button !== undefined) {
      console.log("Going back...");
      button.click();
    }
  });

const getMatches = async page =>
  page.evaluate(async MINIMUM_TIME => {
    const matchesBlocks = document.querySelectorAll(".ipo-Fixture_TableRow");

    // console.log("found", matches);
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
      const teamStack = item.querySelectorAll(".ipo-TeamStack_Team");

      const time = item.querySelector(".ipo-InPlayTimer").innerHTML;

      const team1 = teamStack[0].firstElementChild.innerHTML;

      const mainMarkersScore = item.querySelector(".ipo-MainMarkets")
        .lastElementChild;
      const participantCentered = mainMarkersScore.querySelectorAll(
        ".gll-ParticipantCentered"
      );

      let moreThan = 0;

      let lessThan = 0;

      if (participantCentered.length > 0) {
        moreThan = participantCentered[0].querySelector(
          ".gll-ParticipantCentered_Odds"
        ).innerHTML;

        lessThan = participantCentered[1].querySelector(
          ".gll-ParticipantCentered_Odds"
        ).innerHTML;
      }

      const team2 = teamStack[1].firstElementChild.innerHTML;
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
        moreThan,
        lessThan,
        top: boundaries.top
      });
    });
    // console.log(matchesObj);

    filteredMatches = filterMatches(matchesObj);

    await window.setFilteredMatches(filteredMatches);
    await window.setAllMatches(matchesObj);

    return filteredMatches;
  }, MINIMUM_TIME);

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
      ".ipe-GridHeaderTabLink + div:not(.Hidden)"
    );

    console.log("tabs: ", tabChildren);
    await sleep(1000);
    const array = Array.prototype.slice.call(tabChildren);

    for (let i = array.length - 1; i > 0; i -= 1) {
      console.log(`clicking in ${array[i]}`);
      array[i].click();

      await sleep(1000);
      const items = document.querySelectorAll(
        ".ipe-EventViewDetail_MarketGrid"
      );

      const children = Array.prototype.slice.call(items);

      for (let j = 0; j < children.length; j += 1) {
        const group = children[j].querySelectorAll(".gll-MarketGroup");
        const children2 = Array.prototype.slice.call(group);

        console.log("foundGroup: ", group);
        let goalsTab;

        for (let k = 0; k < children2.length; k += 1) {
          const groupTabTitle =
            children2[k].firstElementChild.children[0].innerHTML;

          console.log("found child", groupTabTitle);

          if (groupTabTitle.includes("Extra")) {
            goalsTab = children2[k];
            const goalsValues = goalsTab
              .querySelector(".gll-MarketGroup_Wrapper")
              .querySelector(".gll-MarketGroupContainer");

            oddsValue = parseFloat(
              goalsValues.lastElementChild.querySelector(
                ".gll-ParticipantOddsOnly_Odds"
              ).innerHTML
            );

            console.log("Found extra goals tab");

            // alert(`Odds: ${oddsValue}`);

            k = children2.length;

            return oddsValue;
          }
        }
      }

      await sleep(250);
    }

    return oddsValue;
  });

const setIds = async (page, previousMatches) =>
  page.evaluate(async previousMatches => {
    const matchesBlocks = document.querySelectorAll(".ipo-Fixture_TableRow");

    // console.log("found", matches);
    const matchesObj = [];
    // eslint-disable-next-line no-unused-vars

    [].forEach.call(matchesBlocks, item => {
      const teamStack = item.querySelectorAll(".ipo-TeamStack_Team");

      const time = item.querySelector(".ipo-InPlayTimer").innerHTML;

      const team1 = teamStack[0].firstElementChild.innerHTML;

      const mainMarkersScore = item.querySelector(".ipo-MainMarkets")
        .lastElementChild;
      const participantCentered = mainMarkersScore.querySelectorAll(
        ".gll-ParticipantCentered"
      );

      let moreThan = 0;

      let lessThan = 0;

      if (participantCentered.length > 0) {
        moreThan = participantCentered[0].querySelector(
          ".gll-ParticipantCentered_Odds"
        ).innerHTML;

        lessThan = participantCentered[1].querySelector(
          ".gll-ParticipantCentered_Odds"
        ).innerHTML;
      }

      const team2 = teamStack[1].firstElementChild.innerHTML;
      const boundaries = item.getBoundingClientRect();

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

const fetchMatches = async () => {
  let allMatches = [];

  let nextMinute = 0;

  let filteredMatches = [];

  let timeout = 0;

  const fetch = async () => {
    const BASE_URL = "https://www.bet365.com/";
    const URL_FRAGMENT = "#/IP/";

    const browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      // args: ["--lang=en-US"]
      // args: ["--proxy-server=zproxy.lum-superproxy.io:22225"]
    });
    const page = await browser.newPage();

    // await page.authenticate({
    //   // username: "lum-customer-hl_999dc5f5-zone-static_res",
    //   username: "lum-customer-hl_999dc5f5-zone-static",
    //   // username: "lum-customer-hl_999dc5f5-zone-static-country-br",
    //   // password: "s6z6grmdpdyx"
    //   password: "juohlhy66kgb"
    // });

    await page.goto(`${BASE_URL}${URL_FRAGMENT}`);

    await page.waitForSelector(".ipo-Fixture_TableRow");
    await page.waitForSelector(".ipo-MainMarkets");

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

      console.log(`Going to match #${matches[i].id} in ${delay / 1000}s`);

      console.log(
        chalk.blue(
          `(${matches[i].time}) ${matches[i].teamA} ${matches[i].scoreA} x ${matches[i].scoreB} ${matches[i].teamB}`
        )
      );
      await sleep(delay);
      const foundMatch = await goesToMatch(matches[i].id, page);

      delay = getRandomDelay(true);
      if (foundMatch) {
        console.log(`Finding goals tab in ${delay / 1000}s`);
        await sleep(delay);
        const odds = await getOdds(page);

        delay = getRandomDelay();

        matches[i].odds = 0;

        if (odds > 0) {
          matches[i].odds = odds;
          console.log(
            chalk.greenBright(
              `${
                matches[i].id
              } contains extra goals tab! Odds: ${odds}. Going back in ${delay /
                1000}s`
            )
          );
        } else {
          console.log(
            chalk.red(
              `${
                matches[i].id
              } doesn't contains extra goals tab. Going back in ${delay /
                1000} `
            )
          );
        }
      } else {
        console.log(`Match no longer exists. Going back in ${delay / 1000}s`);
      }
      await sleep(delay);
      await goBack(page);
      delay = getRandomDelay(false);

      console.log(`On main page. Getting all ids again in ${delay / 1000}s`);
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

    console.log(chalk.greenBright("All matches has been visited"));
    // console.log(chalk.yellowBright(`Next minute: ${nextMinute}`));

    filteredMatches = matches;
    await browser.close();
  };

  await fetch();

  return { matches: filteredMatches, nextMinute };
};

router.use("/match", async (req, res) => {
  const matches = await fetchMatches();

  res.send(matches);
});

module.exports = router;
