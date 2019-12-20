import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { user } from "../entities/user";
import { hashPassword } from "../utils";
import { todo } from "../entities/todo";

class BetController {
  static listAll = async (req: Request, res: Response) => {
    const id = res.locals.jwtPayload.userId;

    const userRepository = getRepository(user);
    const foundUser = await userRepository.findOne(id);
    console.log(foundUser);
    const betRepository = getRepository(todo);
    const todos = await betRepository.find({
      where: { user: foundUser }
    });
    // const users = await userRepository.find({
    //   select: ["id", "email", "role"] //We dont want to send the passwords on response
    // });

    //Send the users object
    res.send(todos);
  };

  static createTodo = async (req: Request, res: Response) => {
    const id = res.locals.jwtPayload.userId;
    const { description, name } = req.body;
    const userRepository = getRepository(user);
    const foundUser = await userRepository.findOne(id);
    const todoRepository = getRepository(todo);
    const todoToAdd = new todo();
    todoToAdd.description = description;
    todoToAdd.name = name;
    todoToAdd.user = foundUser;
    const savedTodo = await todoRepository.save(todoToAdd);
    res.status(200).send(savedTodo);
  };

  static editTodo = async (req: Request, res: Response) => {
    const todoId = req.params.id;
    const { description, name } = req.body;
    const todoRepository = getRepository(todo);
    const foundTodo = await todoRepository.findOne(todoId);
    foundTodo.description = description;
    foundTodo.name = name;
    const savedTodo = await todoRepository.save(foundTodo);
    res.status(200).send(savedTodo);
  };
}

export default BetController;
