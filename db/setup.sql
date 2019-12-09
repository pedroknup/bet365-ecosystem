-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema bet365
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema bet365
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bet365` DEFAULT CHARACTER SET utf8mb4 ;
USE `bet365` ;

-- -----------------------------------------------------
-- Table `bet365`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`role` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`user_status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`user_status` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`country`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`country` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `abr` VARCHAR(6) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(96) NULL DEFAULT NULL,
  `email` VARCHAR(96) NULL DEFAULT NULL,
  `password` VARCHAR(196) NULL DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `profilePic` VARCHAR(96) NULL DEFAULT NULL,
  `statusId` INT(11) NOT NULL DEFAULT '2',
  `roleId` INT(11) NOT NULL DEFAULT '1',
  `countryId` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `status-id_idx` (`statusId` ASC),
  INDEX `user-role-id_idx` (`roleId` ASC),
  INDEX `user-country-id_idx` (`countryId` ASC),
  CONSTRAINT `user-role-id`
    FOREIGN KEY (`roleId`)
    REFERENCES `bet365`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user-status-id`
    FOREIGN KEY (`statusId`)
    REFERENCES `bet365`.`user_status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user-country-id`
    FOREIGN KEY (`countryId`)
    REFERENCES `bet365`.`country` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`forgot_password`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`forgot_password` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(96) NOT NULL,
  `userId` INT(11) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `expiresAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `forgot-user-id_idx` (`userId` ASC),
  CONSTRAINT `forgot-user-id`
    FOREIGN KEY (`userId`)
    REFERENCES `bet365`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`login_provider`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`login_provider` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `appId` VARCHAR(156) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`match`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`match` (
  `id` INT(11) NOT NULL,
  `teamA` VARCHAR(45) NOT NULL,
  `teamB` VARCHAR(45) NOT NULL,
  `date` DATETIME NOT NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `scoreA` INT(11) NOT NULL DEFAULT 0,
  `scoreB` INT(11) NOT NULL DEFAULT 0,
  `odds` FLOAT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`bet`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`bet` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `matchId` INT(11) NOT NULL,
  `value` FLOAT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `todo-user-id_idx` (`userId` ASC),
  INDEX `bet-match-id_idx` (`matchId` ASC),
  CONSTRAINT `bet-user-id`
    FOREIGN KEY (`userId`)
    REFERENCES `bet365`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `bet-match-id`
    FOREIGN KEY (`matchId`)
    REFERENCES `bet365`.`match` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`user_external_login`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`user_external_login` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `userAccountId` VARCHAR(96) NULL DEFAULT NULL,
  `userId` INT(11) NULL DEFAULT NULL,
  `firstName` VARCHAR(45) NULL DEFAULT NULL,
  `lastName` VARCHAR(45) NULL DEFAULT NULL,
  `email` VARCHAR(96) NULL DEFAULT NULL,
  `loginProviderId` INT(11) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `user-external-login-id_idx` (`userId` ASC),
  INDEX `login-provider-id_idx` (`loginProviderId` ASC),
  CONSTRAINT `login-provider-id`
    FOREIGN KEY (`loginProviderId`)
    REFERENCES `bet365`.`login_provider` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `provider-user-external-login-id`
    FOREIGN KEY (`userId`)
    REFERENCES `bet365`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


INSERT INTO `bet365`.`role` (`name`) VALUES ('user');
INSERT INTO `bet365`.`role` (`name`) VALUES ('admin');

INSERT INTO `bet365`.`user_status` (`id`, `name`) VALUES (NULL, 'activated');
INSERT INTO `bet365`.`user_status` (`id`, `name`) VALUES (NULL, 'pendent');
INSERT INTO `bet365`.`user_status` (`id`, `name`) VALUES (NULL, 'deactivated');
INSERT INTO `bet365`.`user_status` (`id`, `name`) VALUES (NULL, 'banned');




INSERT INTO `bet365`.`login_provider` (`id`, `name`, `appId`) VALUES (NULL, 'facebook', '418130689072157');
INSERT INTO `bet365`.`login_provider` (`id`, `name`, `appId`) VALUES (NULL, 'linkedin', '');
INSERT INTO `bet365`.`login_provider` (`id`, `name`, `appId`) VALUES (NULL, 'google', '923738134391-1fvtviaiprlche13vepf2cdb7ht6hagq.apps.googleusercontent.com');

INSERT INTO `bet365`.`user` (`id`, `firstName`, `lastName`, `email`, `password`, `createdAt`, `statusId`, `roleId`) VALUES ('1', 'Admin', 'Admin', 'admin@admin.com', '$2a$08$qFvXV8hTfEdaI3smfJRqse21bxmxWXM1u/cBBhziLXSRSejfJKMKW', '2019-11-28 19:50:40', '1', '2');
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema bet365
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema bet365
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bet365` DEFAULT CHARACTER SET utf8mb4 ;
USE `bet365` ;

-- -----------------------------------------------------
-- Table `bet365`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`role` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`user_status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`user_status` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`country`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`country` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `abr` VARCHAR(6) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(96) NULL DEFAULT NULL,
  `email` VARCHAR(96) NULL DEFAULT NULL,
  `password` VARCHAR(196) NULL DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `profilePic` VARCHAR(96) NULL DEFAULT NULL,
  `statusId` INT(11) NOT NULL DEFAULT '2',
  `roleId` INT(11) NOT NULL DEFAULT '1',
  `countryId` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `status-id_idx` (`statusId` ASC),
  INDEX `user-role-id_idx` (`roleId` ASC),
  INDEX `user-country-id_idx` (`countryId` ASC),
  CONSTRAINT `user-role-id`
    FOREIGN KEY (`roleId`)
    REFERENCES `bet365`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user-status-id`
    FOREIGN KEY (`statusId`)
    REFERENCES `bet365`.`user_status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user-country-id`
    FOREIGN KEY (`countryId`)
    REFERENCES `bet365`.`country` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`forgot_password`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`forgot_password` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(96) NOT NULL,
  `userId` INT(11) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `expiresAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `forgot-user-id_idx` (`userId` ASC),
  CONSTRAINT `forgot-user-id`
    FOREIGN KEY (`userId`)
    REFERENCES `bet365`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`login_provider`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`login_provider` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `appId` VARCHAR(156) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`match`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`match` (
  `id` INT(11) NOT NULL,
  `teamA` VARCHAR(45) NOT NULL,
  `teamB` VARCHAR(45) NOT NULL,
  `date` DATETIME NOT NULL DEFAULT '0',
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `scoreA` INT(11) NOT NULL DEFAULT 0,
  `scoreB` INT(11) NOT NULL DEFAULT 0,
  `odds` FLOAT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`bet`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`bet` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `matchId` INT(11) NOT NULL,
  `value` FLOAT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `todo-user-id_idx` (`userId` ASC),
  INDEX `bet-match-id_idx` (`matchId` ASC),
  CONSTRAINT `bet-user-id`
    FOREIGN KEY (`userId`)
    REFERENCES `bet365`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `bet-match-id`
    FOREIGN KEY (`matchId`)
    REFERENCES `bet365`.`match` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`user_external_login`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`user_external_login` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `userAccountId` VARCHAR(96) NULL DEFAULT NULL,
  `userId` INT(11) NULL DEFAULT NULL,
  `firstName` VARCHAR(45) NULL DEFAULT NULL,
  `lastName` VARCHAR(45) NULL DEFAULT NULL,
  `email` VARCHAR(96) NULL DEFAULT NULL,
  `loginProviderId` INT(11) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `user-external-login-id_idx` (`userId` ASC),
  INDEX `login-provider-id_idx` (`loginProviderId` ASC),
  CONSTRAINT `login-provider-id`
    FOREIGN KEY (`loginProviderId`)
    REFERENCES `bet365`.`login_provider` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `provider-user-external-login-id`
    FOREIGN KEY (`userId`)
    REFERENCES `bet365`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


-- INSERT INTO `bet365`.`role` (`name`) VALUES ('user');
-- INSERT INTO `bet365`.`role` (`name`) VALUES ('admin');

-- INSERT INTO `bet365`.`user_status` (`id`, `name`) VALUES (NULL, 'activated');
-- INSERT INTO `bet365`.`user_status` (`id`, `name`) VALUES (NULL, 'pendent');
-- INSERT INTO `bet365`.`user_status` (`id`, `name`) VALUES (NULL, 'deactivated');
-- INSERT INTO `bet365`.`user_status` (`id`, `name`) VALUES (NULL, 'banned');




-- INSERT INTO `bet365`.`login_provider` (`id`, `name`, `appId`) VALUES (NULL, 'facebook', '418130689072157');
-- INSERT INTO `bet365`.`login_provider` (`id`, `name`, `appId`) VALUES (NULL, 'linkedin', '');
-- INSERT INTO `bet365`.`login_provider` (`id`, `name`, `appId`) VALUES (NULL, 'google', '923738134391-1fvtviaiprlche13vepf2cdb7ht6hagq.apps.googleusercontent.com');

-- INSERT INTO `bet365`.`user` (`id`, `firstName`, `lastName`, `email`, `password`, `createdAt`, `statusId`, `roleId`) VALUES ('1', 'Admin', 'Admin', 'admin@admin.com', '$2a$08$qFvXV8hTfEdaI3smfJRqse21bxmxWXM1u/cBBhziLXSRSejfJKMKW', '2019-11-28 19:50:40', '1', '2');
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema bet365
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema bet365
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bet365` DEFAULT CHARACTER SET utf8mb4 ;
USE `bet365` ;

-- -----------------------------------------------------
-- Table `bet365`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`role` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`user_status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`user_status` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`country`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`country` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `abr` VARCHAR(6) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(96) NULL DEFAULT NULL,
  `email` VARCHAR(96) NULL DEFAULT NULL,
  `password` VARCHAR(196) NULL DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `profilePic` VARCHAR(96) NULL DEFAULT NULL,
  `statusId` INT(11) NOT NULL DEFAULT '2',
  `roleId` INT(11) NOT NULL DEFAULT '1',
  `countryId` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `status-id_idx` (`statusId` ASC),
  INDEX `user-role-id_idx` (`roleId` ASC),
  INDEX `user-country-id_idx` (`countryId` ASC),
  CONSTRAINT `user-role-id`
    FOREIGN KEY (`roleId`)
    REFERENCES `bet365`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user-status-id`
    FOREIGN KEY (`statusId`)
    REFERENCES `bet365`.`user_status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user-country-id`
    FOREIGN KEY (`countryId`)
    REFERENCES `bet365`.`country` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`forgot_password`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`forgot_password` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(96) NOT NULL,
  `userId` INT(11) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `expiresAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `forgot-user-id_idx` (`userId` ASC),
  CONSTRAINT `forgot-user-id`
    FOREIGN KEY (`userId`)
    REFERENCES `bet365`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`login_provider`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`login_provider` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `appId` VARCHAR(156) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`match`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`match` (
  `id` INT(11) NOT NULL,
  `teamA` VARCHAR(45) NOT NULL,
  `teamB` VARCHAR(45) NOT NULL,
  `date` DATETIME NOT NULL DEFAULT '0',
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `scoreA` INT(11) NOT NULL DEFAULT 0,
  `scoreB` INT(11) NOT NULL DEFAULT 0,
  `odds` FLOAT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`bet`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`bet` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `matchId` INT(11) NOT NULL,
  `value` FLOAT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `todo-user-id_idx` (`userId` ASC),
  INDEX `bet-match-id_idx` (`matchId` ASC),
  CONSTRAINT `bet-user-id`
    FOREIGN KEY (`userId`)
    REFERENCES `bet365`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `bet-match-id`
    FOREIGN KEY (`matchId`)
    REFERENCES `bet365`.`match` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`user_external_login`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`user_external_login` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `userAccountId` VARCHAR(96) NULL DEFAULT NULL,
  `userId` INT(11) NULL DEFAULT NULL,
  `firstName` VARCHAR(45) NULL DEFAULT NULL,
  `lastName` VARCHAR(45) NULL DEFAULT NULL,
  `email` VARCHAR(96) NULL DEFAULT NULL,
  `loginProviderId` INT(11) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `user-external-login-id_idx` (`userId` ASC),
  INDEX `login-provider-id_idx` (`loginProviderId` ASC),
  CONSTRAINT `login-provider-id`
    FOREIGN KEY (`loginProviderId`)
    REFERENCES `bet365`.`login_provider` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `provider-user-external-login-id`
    FOREIGN KEY (`userId`)
    REFERENCES `bet365`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


CREATE TABLE IF NOT EXISTS `bet365`.`user_log` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(150) NOT NULL,
  `idUser` INT(11) NOT NULL,
  `type` INT(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `log-user-id_idx` (`idUser` ASC),
  CONSTRAINT `log-user-id`
    FOREIGN KEY (`idUser`)
    REFERENCES `bet365`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


-- INSERT INTO `bet365`.`role` (`name`) VALUES ('user');
-- INSERT INTO `bet365`.`role` (`name`) VALUES ('admin');

-- INSERT INTO `bet365`.`user_status` (`id`, `name`) VALUES ('1', 'activated');
-- INSERT INTO `bet365`.`user_status` (`id`, `name`) VALUES ('2' , 'pendent');
-- INSERT INTO `bet365`.`user_status` (`id`, `name`) VALUES ('3', 'deactivated');
-- INSERT INTO `bet365`.`user_status` (`id`, `name`) VALUES ('4', 'banned');




-- INSERT INTO `bet365`.`login_provider` (`id`, `name`, `appId`) VALUES (NULL, 'facebook', '418130689072157');
-- INSERT INTO `bet365`.`login_provider` (`id`, `name`, `appId`) VALUES (NULL, 'linkedin', '');
-- INSERT INTO `bet365`.`login_provider` (`id`, `name`, `appId`) VALUES (NULL, 'google', '923738134391-1fvtviaiprlche13vepf2cdb7ht6hagq.apps.googleusercontent.com');

-- INSERT INTO `bet365`.`country` (`id`, `name`, `abr`) VALUES ('1', 'brazil', 'br');

-- INSERT INTO `bet365`.`user` (`id`, `firstName`, `lastName`, `email`, `password`, `createdAt`, `statusId`, `roleId`, `countryId`) VALUES ('1', 'Admin', 'Admin', 'admin@admin.com', '$2a$08$qFvXV8hTfEdaI3smfJRqse21bxmxWXM1u/cBBhziLXSRSejfJKMKW', '2019-11-28 19:50:40', '1', '2', '1');

