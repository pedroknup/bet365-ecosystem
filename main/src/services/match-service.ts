const puppeteer = require("puppeteer");
import axios from "axios";
const moment = require("moment");
const chalk = require("chalk");
import config from "../config/config";
import { getRepository, MoreThan } from "typeorm";
import { match } from "../entities/match";

import { notEqual } from "assert";
import { IMatch } from "./match-service";
import { bet } from "../entities/bet";
import { CLIENT_RENEG_LIMIT } from "tls";
import { createUserLog, logLevel } from "./log-service";
import { user_status } from "../entities/user_status";
import { user } from "../entities/user";
const LIMIT = 9;
const MAXIMUM_ODDS = 1.05;
const VALUE_TO_BET = 10;
const SHOULD_LIMIT_TIME = false;
const MAXIMUM_MORE_THAN = 4;
const MAXIMUM_MORE_THAN_AGRESSIVE = 4;
const MAXIMUM_MORE_THAN_CONSERVATIVE = 3;

export interface IMatch {
  id: number;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  time: string;
  url?: string;
  moreThan: number;
  lessThan: number;
  odds: number;
  attacksA: number;
  attacksB: number;
  dangerousAttackA: number;
  dangerousAttackB: number;
  cornerKickA: number;
  cornerKickB: number;
  redCardA: number;
  redCardB: number;
  yellowCardA: number;
  yellowCardB: number;
  onTargetA: number;
  onTargetB: number;
  offTargetA: number;
  offTargetB: number;
  possessionA: number;
  possessionB: number;
}

interface IResponseData {
  matches: IMatch[];
  nextMinute: number;
}

export default class Main {
  private static spiderAlive = false;

  static fetchMatches = async (): Promise<IResponseData> => {
    console.log(
      chalk.yellowBright(`Fetching matches: ${config.scrapperUrl}/v1/match`)
    );
    const response = await axios.get(`${config.scrapperUrl}/match`);
    const data: IResponseData = response.data;

    return data;
  };

  static checkSpider = async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${config.scrapperUrl}/health`);
      Main.spiderAlive = true;
    } catch {
      Main.spiderAlive = false;
    }
    return Main.spiderAlive;
  };

  static loop = async () => {
    let minutes = 0;
    let matchesFiltered: IMatch[] = [];
    let dataLength = 0;
    if (!(await Main.checkSpider())) {
      console.log(
        chalk.red(`Error. Spider service is not running. Trying again in 10s`)
      );
      await sleep(10000);
      await Main.loop();
      return;
    } else {
      try {
        const data = await Main.fetchMatches();
        minutes = data.nextMinute * 60000;

        if (data.matches.length > 0) {
          matchesFiltered = data.matches.filter(item => item.odds > 0);
          dataLength = matchesFiltered.length;
          if (matchesFiltered.length > 0) {
            console.log(
              chalk.greenBright(`Found ${matchesFiltered.length} valid matches`)
            );
            matchesFiltered.forEach(item => {
              console.log(
                `${item.id}: ${item.teamA} ${item.scoreA} x ${item.scoreB} ${
                  item.teamB
                } odds: ${chalk.greenBright(
                  item.odds
                )} more than ${chalk.greenBright(
                  item.moreThan
                )} DA: ${chalk.greenBright(
                  parseInt(item.dangerousAttackA.toString()) +
                    parseInt(item.dangerousAttackB.toString())
                )}. RC: ${chalk.greenBright(
                  parseInt(item.redCardA.toString()) +
                    parseInt(item.redCardB.toString())
                )}`
              );
            });

            Main.saveMatches(matchesFiltered);
          } else {
            console.log(chalk.red(`No valid match founds.`));
          }
        } else {
          console.log(chalk.red(`No valid match founds.`));
        }
        console.log(
          chalk.blue(
            `${moment(new Date()).format("hh:mm:ss")} Running again in ${
              data.nextMinute
            } minute${data.nextMinute > 0 ? "s" : ""}`
          )
        );
      } catch (e) {
        console.log(chalk.red(`Error. Trying again in 1 minute. ${e.message}`));
        minutes = 60000;
      }

      if (minutes === undefined) {
        console.log("There're no matches. Looking again in 5 min...");
        minutes = 60000 * 5;
      } else if (minutes > 60000 * 10) {
        console.log(`${minutes / 60000} min is too big. Changing to 5 min.`);
        minutes = 60000 * 5;
      } else if (minutes < 60000 * 3 && dataLength > 0) {
        console.log(
          `${minutes /
            60000} min is too short and there is a bet process running. Changing to 3 min.`
        );
        minutes = 60000 * 3;
      }
      await sleep(minutes);
      Main.loop();
    }
  };

  static listMatches = async (matches: IMatch[]): Promise<IMatch[]> => {
    const matchRepository = getRepository(match);
    const finalMatches = [];

    for (let i = 0; i < matches.length; i++) {
      const foundMatch = await matchRepository.findOne({
        where: { teamA: matches[i].teamA, teamB: matches[i].teamB }
      });
      if (foundMatch) finalMatches.push(foundMatch);
    }

    return finalMatches;
  };

  static saveMatches = async (matches: IMatch[]): Promise<number> => {
    const matchRepository = getRepository(match);
    const finalMatches: IMatch[] = [];
    const promises = [];

    matches.forEach(async item => {
      const foundMatch = await matchRepository.findOne({
        where: { teamA: item.teamA, teamB: item.teamB }
      });
      if (foundMatch) {
        finalMatches.push({ ...item, id: foundMatch.id });
        // console.log(
        //   `Match ${item.teamA} x ${item.teamB} found. Id: ${foundMatch.id}`
        // );
      } else {
        const newMatch = new match();
        newMatch.teamA = item.teamA;
        newMatch.teamB = item.teamB;
        newMatch.scoreA = item.scoreA;
        newMatch.scoreB = item.scoreB;
        newMatch.url = item.url;
        newMatch.odds = item.odds;
        newMatch.date = new Date();
        newMatch.attacksA = item.attacksA;
        newMatch.attacksB = item.attacksB;
        newMatch.dangerousAttackA = item.dangerousAttackA;
        newMatch.dangerousAttackB = item.dangerousAttackB;
        newMatch.cornerKickA = item.cornerKickA;
        newMatch.cornerKickB = item.cornerKickB;
        newMatch.redCardA = item.redCardA;
        newMatch.redCardB = item.redCardB;
        newMatch.yellowCardA = item.yellowCardA;
        newMatch.yellowCardB = item.yellowCardB;
        newMatch.onTargetA = item.onTargetA;
        newMatch.onTargetB = item.onTargetB;
        newMatch.offTargetA = item.offTargetA;
        newMatch.offTargetB = item.offTargetB;
        newMatch.possessionA = item.possessionA;
        newMatch.possessionB = item.possessionB;
        newMatch.lessThan = item.lessThan;
        const promise = matchRepository
          .save(newMatch)
          .then(result => {
            finalMatches.push({
              teamA: newMatch.teamA,
              teamB: newMatch.teamB,
              scoreA: newMatch.scoreA,
              scoreB: newMatch.scoreB,
              odds: newMatch.odds,
              url: newMatch.url,
              id: result.id,
              attacksA: newMatch.attacksA,
              attacksB: newMatch.attacksB,
              dangerousAttackA: newMatch.dangerousAttackA,
              dangerousAttackB: newMatch.dangerousAttackB,
              cornerKickA: newMatch.cornerKickA,
              cornerKickB: newMatch.cornerKickB,
              redCardA: newMatch.redCardA,
              redCardB: newMatch.redCardB,
              yellowCardA: newMatch.yellowCardA,
              yellowCardB: newMatch.yellowCardB,
              onTargetA: newMatch.onTargetA,
              onTargetB: newMatch.onTargetB,
              offTargetA: newMatch.offTargetA,
              offTargetB: newMatch.offTargetB,
              possessionA: newMatch.possessionA,
              possessionB: newMatch.possessionB,
              time: "",
              moreThan: 0,
              lessThan: newMatch.lessThan
            });
          })
          .catch(e => {
            console.log(
              chalk.red(
                `An error has occurred while trying to save new match into database. ${e.message} `
              )
            );
          });
        promises.push(promise);
      }
    });

    if (promises.length > 0)
      console.log(chalk.greenBright(`${promises.length} new matches.`));
    await Promise.all(promises);

    let filteredMatchesAgressive = matches.filter(item => {
      const redCardA = parseInt(item.redCardA.toString());
      const redCardB = parseInt(item.redCardB.toString());
      // console.log("Red card:", redCardA + redCardB);
      const redCards = redCardA + redCardB;
      return (
        item.odds <= MAXIMUM_ODDS &&
        item.moreThan < MAXIMUM_MORE_THAN_AGRESSIVE &&
        redCards === 0
      );
    });
    const filteredMatchesConservative = matches.filter(item => {
      const redCardA = parseInt(item.redCardA.toString());
      const redCardB = parseInt(item.redCardB.toString());
      const dangerousAttackA = parseInt(item.dangerousAttackA.toString());
      const dangerousAttackB = parseInt(item.dangerousAttackB.toString());
      const redCards = redCardA + redCardB;
      // console.log("Red card:", redCards);
      const dangerousAttacks = dangerousAttackA + dangerousAttackB;
      // console.log("Dangerous Attack:", dangerousAttacks);

      return (
        item.odds <= MAXIMUM_ODDS &&
        item.moreThan < MAXIMUM_MORE_THAN_CONSERVATIVE &&
        redCards === 0 &&
        dangerousAttacks <= 180
      );
    });
    console.log(`Total matches > 80 min: ${matches.length}`);

    const setDateTime = function(date, str) {
      var sp = str.split(":");
      date.setHours(parseInt(sp[0], 10));
      date.setMinutes(parseInt(sp[1], 10));
      date.setSeconds(parseInt(sp[2], 10));
      return date;
    };

    const c = new Date().getTime(),
      start = setDateTime(new Date(), "04:00:00"),
      end = setDateTime(new Date(), "15:00:00");

    let invalidTime = c > start.getTime() && c < end.getTime();
    if (invalidTime) {
      console.log("Interval for aggressive  estrategy");
      filteredMatchesAgressive = [];
    }
    // if (new Date().getTime() >= limitHour.getTime()) {

    if (matches.length > 0) {
      console.log(
        `Agressive strategy filter: ${filteredMatchesAgressive.length}`
      );
      console.log(
        `Conservative strategy filter: ${filteredMatchesConservative.length}`
      );
      await Main.makeBetAllUsers(
        filteredMatchesConservative,
        filteredMatchesAgressive
      );
    }
    if (matches.length > 0) {
      return 60000;
    } else {
      return 60000;
    }
  };

  static makeBetAllUsers = async (
    matchesConservative: IMatch[],
    matchesAgressive: IMatch[]
  ) => {
    const userRepository = getRepository(user);
    const userStatusRepository = getRepository(user_status);
    const activatedStatus = await userStatusRepository.findOne({
      where: { name: "activated" }
    });
    const users = await userRepository.find({
      relations: ["bets", "bets.match", "ip"],
      where: { status: activatedStatus }
    });

    const promises = [];

    users.forEach(userToBet => {
      const selectedArray =
        userToBet.estrategy == 0
          ? matchesConservative
          : userToBet.estrategy == 2
          ? matchesAgressive
          : [];
      promises.push(
        makeBetUser(
          userToBet,
          selectedArray.slice(0, userToBet.simultaneousBet)
        )
      );
    });
    console.log(chalk.blueBright(`New bets: [success/bets]`));
    await Promise.all(promises);
    console.log(chalk.greenBright("Done"));
    return;
  };
}

const getUnfinishedMatches = async matches => {};
const makeBetUser = async (
  user: user,
  matches: IMatch[]
): Promise<IMatch[]> => {
  const filteredMatches = matches.filter(
    item =>
      !user.bets.some(bet => {
        return bet.match.url === item.url;
      })
  );
  console.log(
    chalk.yellow.dim(
      `→ ${user.firstName} ${user.lastName}: ${filteredMatches.length}/${matches.length}`
    )
  );
  if (!user.ip.isValid) {
    console.log(
      chalk.red(
        `User ${user.firstName} ${user.lastName} 'doesn''t have a valid IP`
      )
    );

    return;
  }
  if (user.betUsername && user.betPassword) {
    if (filteredMatches.length > 0) {
      try {
        createUserLog(
          user,
          `Performing bet in ${filteredMatches.length} match${
            filteredMatches.length > 1 ? "es" : ""
          }...`,
          0
        );
        const response = await axios.post("http://localhost:3002/bet/match", {
          user: {
            username: user.betUsername,
            password: user.betPassword
          },
          maxOdd: MAXIMUM_ODDS,
          limitBets: user.simultaneousBet,
          valueToBet: user.betValue,
          ip: user.ip.ip,
          matches: filteredMatches
        });

        const successfullyBets = response.data.successfullyBets;

        const promises = [];
        const betRepository = getRepository(bet);
        const matchRepository = getRepository(match);
        for (let i = 0; i < successfullyBets.length; i++) {
          const item = successfullyBets[i];
          const selectedMatch = await matchRepository.findOne({
            where: { url: item.url }
          });
          const newBet = new bet();
          newBet.match = selectedMatch;
          newBet.odds = item.odds;
          newBet.user = user;
          newBet.value = item.value;
          console.log(
            chalk.white.dim(
              `→ ${user.firstName} ${user.lastName}: ${item.teamA} x ${item.teamB}`
            ),
            chalk.white(`R$ ${item.value},00 : ${item.odds}`)
          );
          createUserLog(
            user,
            `→ ${item.teamA} x ${item.teamB}: R$ ${item.value},00. Odds: ${item.odds} ...`,
            logLevel.success
          );
          promises.push(betRepository.save(newBet));
        }

        console.log(
          `✓ ${user.firstName} ${user.lastName}: [${successfullyBets.length}/${filteredMatches.length}]`
        );

        const length = promises.length;
        await Promise.all(promises);

        console.log(
          `${length} saved bet(s) for ${user.firstName} ${user.lastName}`
        );

        // getResultsUser(user);
      } catch (e) {
        console.log(e.message);
        console.log(
          `x ${user.firstName} ${user.lastName}: [${0}/${
            filteredMatches.length
          }]`
        );
        createUserLog(
          user,
          `x Failed on making ${filteredMatches.length} bet${
            filteredMatches.length > 1 ? "s" : ""
          }. Error message: ${e.message}`,
          logLevel.error
        );
      }
    }
  } else {
    console.log(
      chalk.red(
        `${user.firstName} ${user.lastName} doesn't have a username and/or password.`
      )
    );
  }

  return filteredMatches;
};

export const getResultsUser = async (user: user) => {
  const response = await axios.post("http://localhost:3002/getresults", {
    username: user.betUsername,
    password: user.betPassword,
    ip: user.ip.ip,
    limit: 25
  });
  interface IMatchResponse {
    teamA: string;
    teamB: string;
    win: boolean;
  }
  interface IResponse {
    results: IMatchResponse[];
  }

  const betRepository = getRepository(bet);
  const data: IResponse = response.data;
  const userBets = await betRepository.find({
    where: { user: user },
    order: { createdAt: "DESC" },
    relations: ["match"]
  });
  for (let i = 0; i < data.results.length; i++) {
    let foundMatch: bet;
    for (let j = 0; j < userBets.length; j++) {
      if (
        data.results[i].teamA == userBets[j].match.teamA &&
        data.results[i].teamB == userBets[j].match.teamB
      ) {
        foundMatch = userBets[j];
      }
    }
    console.log(foundMatch);
    if (foundMatch) {
      console.log("FOUND", foundMatch);
      console.log("FOUND", data.results[i]);
      if (foundMatch.win === undefined || foundMatch.win === null) {
        foundMatch.win = data.results[i].win ? 1 : 0;
        console.log(`Updating bet ${foundMatch.id}: ${data.results[i].win}`);
        await betRepository.save(foundMatch);
      }
    }
  }
};

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
