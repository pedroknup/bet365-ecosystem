import { Router } from "express";

import { checkJwt } from "../middlewares/checkJwt";
import TodoController from "../controllers/todo-controller";

const router = Router();

/**
 *
 * @route GET /bet
 * @group Bet - Bet operations
 * @headers {string} auth -
 * @returns {object}  200 - {todo}
 * @returns {Error}  400 -  {error}
 */
router.get("/", checkJwt, TodoController.listAll);

export default router;
