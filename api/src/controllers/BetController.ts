import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { user } from "../entities/user";
import { hashPassword } from "../utils";
import { bet } from "../entities/bet";

class BetController {
  static listAll = async (req: Request, res: Response) => {
    const id = res.locals.jwtPayload.userId;

    const userRepository = getRepository(user);
    const foundUser = await userRepository.findOne(id);
    console.log(foundUser)
    const betRepository = getRepository(bet);
    const bets = await betRepository.find({
      where: { user: foundUser },
      relations: ["match"],
      order: {
        createdAt: 'DESC'
      }
    });
    // const users = await userRepository.find({
    //   select: ["id", "email", "role"] //We dont want to send the passwords on response
    // });

    //Send the users object
    res.send(bets);
  };
}

export default BetController;
