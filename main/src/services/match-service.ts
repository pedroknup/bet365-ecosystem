const puppeteer = require("puppeteer");
import axios from "axios";
const moment = require("moment");
const chalk = require("chalk");
import config from "../config/config";
import { getRepository, MoreThan } from "typeorm";
import { match } from "../entities/match";
import { user } from "../entities/user";
import { notEqual } from "assert";

export interface IMatch {
  id: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  time: string;
  url?: string;
  moreThan: number;
  lessThan: number;
  odds: number;
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
    while (true) {
      if (!(await Main.checkSpider())) {
        console.log(
          chalk.red(`Error. Spider service is not running. Trying again in 10s`)
        );
        await sleep(10000);
      } else {
        try {
          const data = await Main.fetchMatches();
          minutes = data.nextMinute * 60000;
          if (data.matches.length > 0) {
            const matchesFiltered = data.matches.filter(item => item.odds > 0);
            if (matchesFiltered.length > 0) {
              console.log(
                chalk.greenBright(
                  `Found ${matchesFiltered.length} valid matches`
                )
              );
              matchesFiltered.forEach(item => {
                console.log(
                  `${item.id}: ${item.teamA} ${item.scoreA} x ${item.scoreB} ${
                    item.teamB
                  } odds: ${chalk.greenBright(item.odds)} ${item.url}`
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
          console.log(
            chalk.red(`Error. Trying again in 1 minute. ${e.message}`)
          );
          minutes = 60000;
        }

        await sleep(minutes);
      }
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

  static saveMatches = async (matches: IMatch[]): Promise<IMatch[]> => {
    const matchRepository = getRepository(match);
    const finalMatches: IMatch[] = [];
    const promises = [];
    const MAXIMUM_ODDS = 1.05;
    const filteredMatches = matches.filter(item => item.odds <= MAXIMUM_ODDS);
    if (filteredMatches.length > 0)
      console.log(
        chalk.greenBright(
          `${filteredMatches.length}/${matches.length} valid matches (odds <= ${MAXIMUM_ODDS})`
        )
      );
    else
      console.log(
        chalk.red(
          `${filteredMatches.length}/${matches.length} valid matches (odds <= ${MAXIMUM_ODDS})`
        )
      );
    filteredMatches.forEach(async item => {
      const foundMatch = await matchRepository.findOne({
        where: { teamA: item.teamA, teamB: item.teamB }
      });
      if (foundMatch) {
        finalMatches.push({ ...item, id: `id-${foundMatch.id}` });
        // console.log(
        //   `Match ${item.teamA} x ${item.teamB} found. Id: ${foundMatch.id}`
        // );
      } else {
        const newMatch = new match();
        newMatch.teamA = item.teamA;
        newMatch.teamB = item.teamB;
        newMatch.scoreA = item.scoreA;
        newMatch.scoreB = item.scoreB;
        newMatch.odds = item.odds;
        newMatch.date = new Date();

        const promise = matchRepository
          .save(newMatch)
          .then(result => {
            finalMatches.push({
              teamA: newMatch.teamA,
              teamB: newMatch.teamB,
              scoreA: newMatch.scoreA,
              scoreB: newMatch.scoreB,
              odds: newMatch.odds,
              id: `${result.id}`,
              time: "",
              moreThan: 0,
              lessThan: 0
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

    if (promises.length>0)
    console.log(chalk.greenBright(`${promises.length} new matches.`));
    await Promise.all(promises);

    Main.makeBetAllUsers(filteredMatches);
    return finalMatches;
  };

  static makeBetAllUsers = async (matches: IMatch[]) => {
    const userRepository = getRepository(user);
    const users = await userRepository.find({});
    if (matches.length > 0)
      console.log(
        chalk.black.bgGreen(
          `Creating bets for ${matches.length} matches for ${chalk.red.bgGreen(
            ` ${users.length} `
          )} users`
        )
      );
  };
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
