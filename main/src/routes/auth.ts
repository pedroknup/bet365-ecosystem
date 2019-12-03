import { Router } from "express";
import AuthController from "../controllers/AuthController";

interface ILoginBody {
  email?: string;
  password?: string;
  fbToken?: string;
  googleToken?: string;
  linkedinToken?: string;
  twitterToken?: string;
}
const router = Router();

router.post("/login", AuthController.login);


export default router;
