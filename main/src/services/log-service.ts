import { user } from "../entities/user";
import { getRepository } from "typeorm";
import { user_log } from "../entities/user_log";

export enum logLevel {
  normal = 0,
  warning = 1,
  info = 2,
  success = 3,
  error = 4
}
export const createUserLog = async (
  user: user,
  text: string,
  level: logLevel
): Promise<void> => {
  try {
    const logRepository = getRepository(user_log);
    const newLog = new user_log();
    newLog.idUser = user;
    newLog.text = text;
    newLog.type = level;
    await logRepository.save(newLog);
  } catch {
    
  }
};
