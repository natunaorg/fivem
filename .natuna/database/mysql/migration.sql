CREATE DATABASE IF NOT EXISTS `natuna` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `ban_lists` (
  `license` varchar(255) NOT NULL,
  `reason` longtext NOT NULL,
  PRIMARY KEY (`license`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `characters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `last_position` longtext DEFAULT NULL,
  `skin` longtext DEFAULT NULL,
  `health` int(11) DEFAULT NULL,
  `armour` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `license` varchar(255) NOT NULL,
  `active_character_id` int(11) DEFAULT NULL,
  `last_ip` varchar(255) DEFAULT NULL,
  `last_login` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `active_character_id` (`active_character_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `whitelist_lists` (
  `license` varchar(255) NOT NULL,
  PRIMARY KEY (`license`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `characters` 
  DROP CONSTRAINT IF EXISTS `characters_ibfk_1`;
ALTER TABLE `characters` 
  ADD CONSTRAINT `characters_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `users` 
  DROP CONSTRAINT IF EXISTS `users_ibfk_1`;
ALTER TABLE `users` 
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`active_character_id`) REFERENCES `characters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
