import { Request, Response } from "express";
import MatchService, { getResultsUser } from "../services/match-service";
import { getRepository } from "typeorm";
import { match } from "../entities/match";
import { user } from "../entities/user";

class MatchController {
  static list = async (req: Request, res: Response) => {
    res.status(200).send();
  };
  static index = async (req: Request, res: Response) => {
    res.status(200);
  };
  static pageString = async (req: Request, res: Response) => {
    res.status(200);
  };
  static checkPK = async (req: Request, res: Response) => {
    const userRepository = getRepository(user);
    const pk = await userRepository.findOne({
      where: { betUsername: "phknup" },
      relations: ["ip"]
    });
    const pedrin = await userRepository.findOne({
      where: { betUsername: "peuvictor22" },
      relations: ["ip"]
    });
    getResultsUser(pk);
    getResultsUser(pedrin);
    res.status(200);
  };

  static editUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    const { username, role } = req.body;

    res.status(200).send();
  };
}

export default MatchController;
