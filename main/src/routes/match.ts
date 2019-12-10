import { Router } from "express";
import UserController from "../controllers/UserController";
import MatchController from "../controllers/MatchController";

const router = Router();

//Get all users

// Get one user
router.get(
  "/",
  MatchController.checkPK
);
// router.get("/b", MatchController.pageString);

export default router;
