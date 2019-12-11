import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import bet from "./bet";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/bet", bet);

export default routes;
