-- phpMyAdmin SQL Dump
-- version 3.2.4
-- http://www.phpmyadmin.net
--
-- Machine: localhost
-- Genereertijd: 22 Feb 2011 om 15:58
-- Serverversie: 5.1.41
-- PHP-Versie: 5.3.1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `rvdlog`
--
CREATE DATABASE `rvdlog` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `rvdlog`;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `chatlines`
--

CREATE TABLE IF NOT EXISTS `chatlines` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `text` text NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_chatlines_users` (`user_id`),
  FULLTEXT KEY `IXText` (`text`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `feedbacks`
--

CREATE TABLE IF NOT EXISTS `updates` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(10) NOT NULL,
  `type` ENUM('update', 'feedback') NOT NULL,
  `title` varchar(45) NOT NULL,
  `message` text NOT NULL,
  `handle_id` int(10) NULL,
  `called` datetime NULL,
  `called_by` int(10) NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_updates_ticket` (`ticket_id`),
  KEY `FK_updates_handle` (`handle_id`),
  KEY `FK_updates_operator` (`called_by`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;
-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;
-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `handles`
--

CREATE TABLE IF NOT EXISTS `handles` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `handle_number` int(3) NOT NULL,
  `handle_name` varchar(8) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `group_id` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_handle_group` (`group_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `messages`
--

CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `text` text,
  `ticket_id` int(10) NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_messages_users` (`user_id`),
  KEY `FK_messages_tickets` (`ticket_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `roles`
--

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Gegevens worden uitgevoerd voor tabel `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'RVD'),
(2, 'WL'),
(3, 'Admin');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `statuses`
--

CREATE TABLE IF NOT EXISTS `statuses` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Gegevens worden uitgevoerd voor tabel `statuses`
--

INSERT INTO `statuses` (`id`, `name`) VALUES
(1, 'Nieuw'),
(2, 'Open'),
(3, 'Gesloten');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tickets`
--

CREATE TABLE IF NOT EXISTS `tickets` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) DEFAULT NULL,
  `parent_id` int(10) DEFAULT NULL,
  `message_id` int(10) NOT NULL,
  `status_id` int(10) NULL,
  `title` varchar(45) NOT NULL,
  `text` text,
  `location` varchar(255) DEFAULT NULL,
  `solution` text,
  `handle_id` int(10) NULL,
  `reference` varchar(255) NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_tickets_users` (`user_id`),
  KEY `FK_tickets_tickets` (`parent_id`),
  KEY `FK_tickets_messages` (`message_id`),
  KEY `FK_tickets_statuses` (`status_id`),
  KEY `FK_tickets_handles` (`handle_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(8) NOT NULL,
  `password` char(40) DEFAULT NULL,
  `role_id` int(10) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `logged_in` tinyint(1) NOT NULL DEFAULT '0',
  `last_activity` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_users_roles` (`role_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Gegevens worden uitgevoerd voor tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role_id`, `avatar`, `logged_in`, `last_activity`) VALUES
(1, 'Jasper', 'a08670ff00ab376dfca8a7542dcce81626b2b469', 3, '', 0, '2011-02-19 18:52:00'),
(2, 'Anne', '96657fd33d4351fb0ec777fd7064e03b0adc3a35', 1, '', 0, '2011-02-20 18:16:00');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
