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
-- Table `bet365`.`ValidIp`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`ValidIp` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `ip` VARCHAR(20) NOT NULL,
  `isValid` TINYINT(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 47
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`match`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`match` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `teamA` VARCHAR(45) NOT NULL,
  `teamB` VARCHAR(45) NOT NULL,
  `date` DATETIME NOT NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `scoreA` INT(11) NOT NULL DEFAULT '0',
  `scoreB` INT(11) NOT NULL DEFAULT '0',
  `odds` FLOAT NOT NULL DEFAULT '0',
  `url` VARCHAR(95) NOT NULL,
  `possessionA` INT(11) NOT NULL DEFAULT '0',
  `possessionB` INT(11) NOT NULL DEFAULT '0',
  `attacksA` INT(11) NOT NULL DEFAULT '0',
  `attacksB` INT(11) NOT NULL DEFAULT '0',
  `dangerousAttackA` INT(11) NOT NULL DEFAULT '0',
  `dangerousAttackB` INT(11) NOT NULL DEFAULT '0',
  `cornerKickA` INT(11) NOT NULL DEFAULT '0',
  `cornerKickB` INT(11) NOT NULL DEFAULT '0',
  `redCardA` INT(11) NOT NULL DEFAULT '0',
  `redCardB` INT(11) NOT NULL DEFAULT '0',
  `yellowCardA` INT(11) NOT NULL DEFAULT '0',
  `yellowCardB` INT(11) NOT NULL DEFAULT '0',
  `onTargetA` INT(11) NOT NULL DEFAULT '0',
  `onTargetB` INT(11) NOT NULL DEFAULT '0',
  `offTargetA` INT(11) NOT NULL DEFAULT '0',
  `offTargetB` INT(11) NOT NULL DEFAULT '0',
  `lessThan` DOUBLE NULL DEFAULT NULL,
  `winner` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 679
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
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4;


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
AUTO_INCREMENT = 9
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
  `betUsername` VARCHAR(45) NULL DEFAULT NULL,
  `betPassword` VARCHAR(45) NULL DEFAULT NULL,
  `simultaneousBet` INT(11) NOT NULL DEFAULT '1',
  `betValue` FLOAT NOT NULL DEFAULT '0',
  `ip` INT(11) NOT NULL DEFAULT '1',
  `estrategy` INT(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `status-id_idx` (`statusId` ASC),
  INDEX `user-role-id_idx` (`roleId` ASC),
  INDEX `user-country-id_idx` (`countryId` ASC),
  INDEX `user-ip_idx` (`ip` ASC),
  CONSTRAINT `user-country-id`
    FOREIGN KEY (`countryId`)
    REFERENCES `bet365`.`country` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user-ip`
    FOREIGN KEY (`ip`)
    REFERENCES `bet365`.`ValidIp` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user-role-id`
    FOREIGN KEY (`roleId`)
    REFERENCES `bet365`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user-status-id`
    FOREIGN KEY (`statusId`)
    REFERENCES `bet365`.`user_status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bet365`.`bet`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`bet` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `matchId` INT(11) NOT NULL,
  `value` FLOAT NOT NULL DEFAULT '0',
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` INT(11) NOT NULL,
  `odds` FLOAT NULL DEFAULT '0',
  `win` TINYINT(4) NULL DEFAULT NULL,
  `return` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `todo-user-id_idx` (`userId` ASC),
  INDEX `bet-match-id_idx` (`matchId` ASC),
  CONSTRAINT `bet-match-id`
    FOREIGN KEY (`matchId`)
    REFERENCES `bet365`.`match` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `bet-user-id`
    FOREIGN KEY (`userId`)
    REFERENCES `bet365`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 605
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
AUTO_INCREMENT = 7
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


-- -----------------------------------------------------
-- Table `bet365`.`user_log`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bet365`.`user_log` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(150) NOT NULL,
  `idUser` INT(11) NOT NULL,
  `type` INT(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `log-user-id_idx` (`idUser` ASC),
  CONSTRAINT `log-user-id`
    FOREIGN KEY (`idUser`)
    REFERENCES `bet365`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 993
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


INSERT INTO `user_status` VALUES (1,'activated'),(2,'pendent'),(3,'deactivated'),(8,'banned');
INSERT INTO `role` VALUES (1,'user'),(2,'admin');
INSERT INTO `country` VALUES (1,'Brazil','br');
INSERT INTO `ValidIp` VALUES (1,'89.185.76.16',1),(2,'185.81.144.248',1),(11,'89.185.76.220',1),(12,'89.185.76.221',1),(13,'89.185.76.222',1),(14,'89.185.76.223',1),(15,'89.185.76.224',1),(16,'89.185.76.225',1),(17,'89.185.76.226',1),(18,'89.185.76.227',1),(19,'89.185.76.228',1),(20,'89.85.76.229',1),(21,'89.185.76.230',1),(22,'89.185.76.231',1),(23,'89.185.76.232',1),(24,'89.185.76.233',1),(25,'89.185.76.234',1),(26,'89.185.76.235',1),(27,'89.185.76.236',1),(28,'89.185.76.237',1),(29,'89.185.76.238',1),(30,'89.185.76.239',1),(31,'89.185.76.240',1),(32,'89.185.76.241',1),(33,'89.185.76.242',1),(34,'89.185.76.243',1),(35,'89.185.76.244',1),(36,'89.185.76.245',1),(37,'89.185.76.246',1),(38,'89.185.76.247',1),(39,'89.185.76.248',1),(40,'89.185.76.249',1),(41,'89.185.76.250',1),(42,'89.185.76.251',1),(43,'89.185.76.252',1),(44,'89.185.76.253',1),(45,'89.185.76.254',1),(46,'89.185.76.255',1);
INSERT INTO `login_provider` VALUES (4,'facebook','418130689072157'),(5,'linkedin',''),(6,'google','923738134391-1fvtviaiprlche13vepf2cdb7ht6hagq.apps.googleusercontent.com');
INSERT INTO `user` VALUES (2,'Pedro','Victor','peuvictor22@gmail.com','123123','2019-12-03 19:50:06',NULL,1,1,1,'peuvictor22','Camila22',18,2,1,2),(3,'Pedro','Knup','phknup@gmail.com','123123','2019-12-06 13:19:13',NULL,1,1,1,'phknup','12012012Pk',4,2,12,2);
