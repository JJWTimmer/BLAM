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

--
-- Gegevens worden uitgevoerd voor tabel `chatlines`
--

INSERT INTO `chatlines` (`id`, `user_id`, `text`, `created`) VALUES
(1, 1, 'Hihi', '2011-02-20 18:16:56'),
(2, 2, 'Wat is er?', '2011-02-20 18:17:07'),
(3, 1, 'Je veter zit los', '2011-02-20 18:17:15');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `feedbacks`
--

CREATE TABLE IF NOT EXISTS `feedbacks` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(10) NOT NULL,
  `title` varchar(45) NOT NULL,
  `handle_id` int(10) NOT NULL,
  `message` text NOT NULL,
  `called` datetime DEFAULT NULL,
  `called_by` int(10) NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_feedback_ticket` (`ticket_id`),
  KEY `FK_feedback_handle` (`handle_id`),
  KEY `FK_feedback_operator` (`called_by`),
  FULLTEXT KEY `IXMessage` (`title`,`message`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Gegevens worden uitgevoerd voor tabel `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `ticket_id`, `title`, `handle_id`, `message`, `called`, `created`) VALUES
(1, 1, 'donuts halen', 2, 'Meldt zure pruim: 5 gesuikerde donuts naar WL', NULL, '2011-02-20 20:09:10');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Gegevens worden uitgevoerd voor tabel `groups`
--

INSERT INTO `groups` (`id`, `name`) VALUES
(1, 'Autodropjes'),
(2, 'Racemonsters');

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

--
-- Gegevens worden uitgevoerd voor tabel `handles`
--

INSERT INTO `handles` (`id`, `handle_number`, `handle_name`, `description`, `group_id`) VALUES
(1, 123, 'bata-123', 'postsorteerder', 1),
(2, 456, 'bata-456', 'zure pruim', 1),
(3, 7, 'bata-007', 'Aston Martin', 2);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `messages`
--

CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `text` text,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_messages_users` (`user_id`),
  FULLTEXT KEY `IXText` (`text`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Gegevens worden uitgevoerd voor tabel `messages`
--

INSERT INTO `messages` (`id`, `user_id`, `text`, `created`) VALUES
(1, 1, 'Bata-502 is onderweg naar een of ander checkpoint.', '2011-02-20 18:17:56'),
(2, 1, 'Moet bata-405 nog iets doen?', '2011-02-20 18:18:16');

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
  `title` varchar(45) NOT NULL,
  `message_id` int(10) NOT NULL,
  `status_id` int(10) NOT NULL,
  `handle_id` int(10) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `text` text,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_tickets_users` (`user_id`),
  KEY `FK_tickets_tickets` (`parent_id`),
  KEY `FK_tickets_messages` (`message_id`),
  KEY `FK_tickets_statuses` (`status_id`),
  KEY `FK_tickets_handles` (`handle_id`),
  FULLTEXT KEY `IXTickets` (`title`,`location`,`text`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Gegevens worden uitgevoerd voor tabel `tickets`
--

INSERT INTO `tickets` (`id`, `user_id`, `parent_id`, `title`, `message_id`, `status_id`, `handle_id`, `location`, `text`, `created`, `modified`) VALUES
(1, NULL, NULL, 'zure pruim taak toewijzen', 2, 1, 2, 'hier en daar', 'Uitzoeken of 405 nog een taak heeft en hem op weg sturen', '2011-02-20 18:26:24', '2011-02-20 20:11:27'),
(2, 1, 1, 'uitgezocht: donuts halen', 2, 2, 2, '', 'feedback verzoek gemaakt, donuts halen...', '2011-02-20 18:46:34', '2011-02-20 18:46:34');

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
