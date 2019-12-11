import { Router } from "express";

import { checkJwt } from "../middlewares/checkJwt";
import BetController from "../controllers/BetController";

const router = Router();

/**
 *
 * @route GET /bet
 * @group Bet - Bet operations
 * @headers {string} auth -
 * @returns {object}  200 - {user, token}
 * @returns {Error}  400 -  {error}
 */
router.get("/", checkJwt, BetController.listAll);

export default router;
