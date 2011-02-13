SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE SCHEMA IF NOT EXISTS `rvdlog` DEFAULT CHARACTER SET latin1 ;
USE `rvdlog` ;

-- -----------------------------------------------------
-- Table `rvdlog`.`role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rvdlog`.`role` ;

CREATE  TABLE IF NOT EXISTS `rvdlog`.`role` (
  `Id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
  `Name` VARCHAR(10) NOT NULL ,
  PRIMARY KEY (`Id`) ,
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) ,
  UNIQUE INDEX `Name_UNIQUE` (`Name` ASC) )
ENGINE = MyISAM
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `rvdlog`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rvdlog`.`user` ;

CREATE  TABLE IF NOT EXISTS `rvdlog`.`user` (
  `Id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
  `Username` VARCHAR(8) NOT NULL ,
  `Password` CHAR(40) NULL DEFAULT NULL ,
  `RoleId` INT(10) UNSIGNED NOT NULL ,
  `Avatar` VARCHAR(255) NULL DEFAULT NULL ,
  `LoggedIn` TINYINT(4) NOT NULL DEFAULT '0' ,
  `LastActivity` TIMESTAMP NULL DEFAULT NULL ,
  PRIMARY KEY (`Id`, `RoleId`) ,
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) ,
  UNIQUE INDEX `Username_UNIQUE` (`Username` ASC) ,
  CONSTRAINT `fk_user_role1`
    FOREIGN KEY (`RoleId` )
    REFERENCES `rvdlog`.`role` (`Id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `rvdlog`.`chatline`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rvdlog`.`chatline` ;

CREATE  TABLE IF NOT EXISTS `rvdlog`.`chatline` (
  `Id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
  `UserId` INT(10) UNSIGNED NOT NULL ,
  `Text` TEXT NOT NULL ,
  `TimeStamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`Id`, `UserId`) ,
  INDEX `IXTimestamp` (`TimeStamp` ASC) ,
  FULLTEXT INDEX `IXText` (`Text` ASC) ,
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) ,
  CONSTRAINT `fk_chatline_user`
    FOREIGN KEY (`UserId` )
    REFERENCES `rvdlog`.`user` (`Id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `rvdlog`.`message`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rvdlog`.`message` ;

CREATE  TABLE IF NOT EXISTS `rvdlog`.`message` (
  `Id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
  `UserId` INT(10) UNSIGNED NOT NULL ,
  `Text` TEXT NULL DEFAULT NULL ,
  `Timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`Id`, `UserId`) ,
  INDEX `IXTimestamp` (`Timestamp` ASC) ,
  FULLTEXT INDEX `IXText` (`Text` ASC) ,
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) ,
  CONSTRAINT `fk_message_user1`
    FOREIGN KEY (`UserId` )
    REFERENCES `rvdlog`.`user` (`Id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `rvdlog`.`status`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rvdlog`.`status` ;

CREATE  TABLE IF NOT EXISTS `rvdlog`.`status` (
  `Id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
  `Name` VARCHAR(10) NOT NULL ,
  PRIMARY KEY (`Id`) ,
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) ,
  UNIQUE INDEX `Name_UNIQUE` (`Name` ASC) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `rvdlog`.`handle`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rvdlog`.`handle` ;

CREATE  TABLE IF NOT EXISTS `rvdlog`.`handle` (
  `Id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
  `HandleNumber` INT(11) NOT NULL ,
  `HandleName` VARCHAR(8) NOT NULL ,
  `Description` VARCHAR(255) NULL DEFAULT NULL ,
  PRIMARY KEY (`Id`) ,
  INDEX `IXDescription` (`Description` ASC) ,
  UNIQUE INDEX `HandleNumber_UNIQUE` (`HandleNumber` ASC) ,
  UNIQUE INDEX `HandleName_UNIQUE` (`HandleName` ASC) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `rvdlog`.`ticket`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rvdlog`.`ticket` ;

CREATE  TABLE IF NOT EXISTS `rvdlog`.`ticket` (
  `Id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
  `UserId` INT(10) UNSIGNED NULL ,
  `ParentId` INT(10) UNSIGNED NULL DEFAULT NULL ,
  `MessageId` INT(10) UNSIGNED NOT NULL ,
  `StatusId` INT(10) UNSIGNED NOT NULL ,
  `HandleId` INT(10) UNSIGNED NOT NULL ,
  `Locatie` VARCHAR(255) NULL DEFAULT NULL ,
  `Text` TEXT NULL DEFAULT NULL ,
  `Timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`Id`, `UserId`, `StatusId`, `HandleId`, `MessageId`) ,
  FULLTEXT INDEX `IXLocatie` (`Locatie` ASC) ,
  FULLTEXT INDEX `IXText` (`Text` ASC) ,
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) ,
  CONSTRAINT `fk_ticket_user1`
    FOREIGN KEY (`UserId` )
    REFERENCES `rvdlog`.`user` (`Id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ticket_message1`
    FOREIGN KEY (`MessageId` )
    REFERENCES `rvdlog`.`message` (`Id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ticket_status1`
    FOREIGN KEY (`StatusId` )
    REFERENCES `rvdlog`.`status` (`Id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ticket_handle1`
    FOREIGN KEY (`HandleId` )
    REFERENCES `rvdlog`.`handle` (`Id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `rvdlog`.`feedback`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rvdlog`.`feedback` ;

CREATE  TABLE IF NOT EXISTS `rvdlog`.`feedback` (
  `Id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
  `TicketId` INT(10) UNSIGNED NOT NULL ,
  `HandleId` INT(10) UNSIGNED NOT NULL ,
  `Message` TEXT NOT NULL ,
  `Called` TIMESTAMP NULL ,
  `Timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`Id`, `HandleId`, `TicketId`) ,
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) ,
  CONSTRAINT `fk_feedback_ticket1`
    FOREIGN KEY (`TicketId` )
    REFERENCES `rvdlog`.`ticket` (`Id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_feedback_handle1`
    FOREIGN KEY (`HandleId` )
    REFERENCES `rvdlog`.`handle` (`Id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = MyISAM
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Placeholder table for view `rvdlog`.`current_messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rvdlog`.`current_messages` (`Id` INT, `Username` INT, `Text` INT, `Timestamp` INT);

-- -----------------------------------------------------
-- Placeholder table for view `rvdlog`.`new_tickets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rvdlog`.`new_tickets` (`Id` INT, `Tekst` INT, `Timestamp` INT);

-- -----------------------------------------------------
-- Placeholder table for view `rvdlog`.`open_tickets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rvdlog`.`open_tickets` (`Id` INT, `Verantwoordelijke` INT, `Aanroeper` INT, `Tekst` INT, `Status` INT, `Timestamp` INT);

-- -----------------------------------------------------
-- Placeholder table for view `rvdlog`.`closed_tickets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rvdlog`.`closed_tickets` (`Id` INT, `Verantwoordelijke` INT, `Aanroeper` INT, `Tekst` INT, `Status` INT, `Timestamp` INT);

-- -----------------------------------------------------
-- View `rvdlog`.`current_messages`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `rvdlog`.`current_messages` ;
DROP TABLE IF EXISTS `rvdlog`.`current_messages`;
USE `rvdlog`;
CREATE  OR REPLACE VIEW `rvdlog`.`current_messages` AS
SELECT m.`Id`, u.`Username`, m.`Text`, m.`Timestamp`
FROM `message` AS m INNER JOIN `user` AS u ON m.`UserId` = u.`Id`
WHERE m.`Timestamp` > NOW() + INTERVAL 1 DAY;

-- -----------------------------------------------------
-- View `rvdlog`.`new_tickets`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `rvdlog`.`new_tickets` ;
DROP TABLE IF EXISTS `rvdlog`.`new_tickets`;
USE `rvdlog`;
CREATE  OR REPLACE VIEW `rvdlog`.`new_tickets` AS
SELECT t.`Id` As Id, m.`Text` As Tekst, t.`Timestamp` As Timestamp
FROM `ticket` AS t
    INNER JOIN `message` AS m ON t.`MessageId` = m.`Id`
    INNER JOIN `status` AS s ON t.`StatusId` = s.`Id`
WHERE t.`UserId` = NULL
    AND t.`ParentId` = -1;

-- -----------------------------------------------------
-- View `rvdlog`.`open_tickets`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `rvdlog`.`open_tickets` ;
DROP TABLE IF EXISTS `rvdlog`.`open_tickets`;
USE `rvdlog`;
CREATE  OR REPLACE VIEW `rvdlog`.`open_tickets` AS
SELECT t.`Id` AS Id, u.`Username` AS Verantwoordelijke, h.`Description` AS Aanroeper, m.`Text` AS Tekst,
    s.`Name` AS Status, t.`Timestamp` As Timestamp
FROM `ticket` AS t
    INNER JOIN `message` AS m ON t.`MessageId` = m.`Id`
    INNER JOIN `status` AS s ON t.`StatusId` = s.`Id`
    INNER JOIN `handle` AS h ON t.`HandleId` = h.`Id`
    INNER JOIN `user` AS u ON t.`UserId` = u.`Id`
WHERE s.`Name` <> 'Gesloten'
    AND t.`ParentId` = -1;

-- -----------------------------------------------------
-- View `rvdlog`.`closed_tickets`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `rvdlog`.`closed_tickets` ;
DROP TABLE IF EXISTS `rvdlog`.`closed_tickets`;
USE `rvdlog`;
CREATE  OR REPLACE VIEW `rvdlog`.`closed_tickets` AS
SELECT t.`Id` AS Id, u.`Username` AS Verantwoordelijke, h.`Description` AS Aanroeper, m.`Text` AS Tekst,
    s.`Name` AS Status, t.`Timestamp` As Timestamp
FROM `ticket` AS t
    INNER JOIN `message` AS m ON t.`MessageId` = m.`Id`
    INNER JOIN `status` AS s ON t.`StatusId` = s.`Id`
    INNER JOIN `handle` AS h ON t.`HandleId` = h.`Id`
    INNER JOIN `user` AS u ON t.`UserId` = u.`Id`
WHERE s.`Name` = 'Gesloten'
    AND t.`ParentId` = -1;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
