import { Request, Response } from "express";
import MatchService from "../services/match-service";
import { getRepository } from "typeorm";
import { match } from "../entities/match";

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

  static editUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    const { username, role } = req.body;

    res.status(200).send();
  };
}

export default MatchController;
