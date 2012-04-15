-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Machine: localhost
-- Genereertijd: 20 mrt 2012 om 22:36
-- Serverversie: 5.5.16
-- PHP-Versie: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `blam`
--
CREATE DATABASE `blam` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `blam`;

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
  `gps_status` tinyint(1) NOT NULL DEFAULT '0',
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
  `ticket_id` int(10) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  `updated` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_messages_users` (`user_id`),
  KEY `FK_messages_tickets` (`ticket_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `reminders`
--

CREATE TABLE IF NOT EXISTS `reminders` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) DEFAULT NULL,
  `backup_user_id` int(10) DEFAULT NULL,
  `group_id` int(10) DEFAULT NULL,
  `title` varchar(45) NOT NULL,
  `text` text,
  `begin` datetime NOT NULL,
  `end` datetime NOT NULL,
  `completed` datetime DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_reminders_users` (`user_id`),
  KEY `FK_reminders_users2` (`backup_user_id`),
  KEY `FK_reminders_roles` (`group_id`)
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
  `status_id` int(10) DEFAULT NULL,
  `assign` enum('--','UK','MK') NOT NULL,
  `title` varchar(45) NOT NULL,
  `text` text,
  `location` varchar(255) DEFAULT NULL,
  `solution` text,
  `handle_id` int(10) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `updated` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_tickets_users` (`user_id`),
  KEY `FK_tickets_tickets` (`parent_id`),
  KEY `FK_tickets_messages` (`message_id`),
  KEY `FK_tickets_statuses` (`status_id`),
  KEY `FK_tickets_handles` (`handle_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `updates`
--

CREATE TABLE IF NOT EXISTS `updates` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(10) NOT NULL,
  `type` enum('update','feedback','answer','addition') NOT NULL,
  `message` text NOT NULL,
  `called` datetime DEFAULT NULL,
  `called_by` int(10) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `updated` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_updates_ticket` (`ticket_id`),
  KEY `FK_updates_operator` (`called_by`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Gegevens worden uitgevoerd voor tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role_id`, `avatar`, `logged_in`, `last_activity`) VALUES
(1, 'Jasper', 'a08670ff00ab376dfca8a7542dcce81626b2b469', 3, '', 1, '2012-03-20 22:24:46'),
(2, 'Anne', '213bf94d31b9b21100e4fb2b86bebb29a2d8bf5c', 3, '', 0, '2011-02-20 18:16:00'),
(3, 'Martijn', '10ae63b69ae5ab71b07f9e64004a0207f53fea34', 3, '', 0, '2011-12-11 00:00:00');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `autotext`
--

CREATE TABLE IF NOT EXISTS `autotext` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `text` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Gegevens worden uitgevoerd voor tabel `autotext`
--

INSERT INTO `autotext` (`id`, `text`) VALUES
(1, 'meldt aankomst bij WP X'),
(2, 'meldt WP X klaar voor eerste loper'),
(3, 'Eerste loper heeft WP X gepasseerd om xx:yy'),
(4, 'Laatste loper heeft WP X gepasseerd'),
(5, 'Is WP X gepasseerd met X lopers voor zich'),
(6, 'Stapt uit het voertuig en is tijdelijk niet bereikbaar'),
(7, 'Is terug in het voertuig en is weer bereikbaar');