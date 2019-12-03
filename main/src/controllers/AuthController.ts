import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import config from "../config/config";
import { UserService } from "../services";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { fbToken, googleToken, linkedinToken, email, password } = req.body;

    const loginWithSocial = fbToken || googleToken || linkedinToken;
    const loginWithEmail = !!password;

    //Send the jwt in the response
    // res.send({ user: foundUser, token });
  };
}
export default AuthController;
