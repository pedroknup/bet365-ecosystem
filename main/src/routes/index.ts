import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import match from "./match";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/match", match);

export default routes;
