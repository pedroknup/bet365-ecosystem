import { Request, Response } from "express";
import { validate } from "class-validator";


class UserController {
  

  static getOneById = async (req: Request, res: Response) => {
   
  };

  

  static editUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    const { username, role } = req.body;

  
    res.status(200).send();
  };
}

export default UserController;
