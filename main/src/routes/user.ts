import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();

//Get all users

// Get one user
router.get(
  "/:id([0-9]+)",

  UserController.getOneById
);

export default router;
