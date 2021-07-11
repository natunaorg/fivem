-- Create the Database
CREATE DATABASE IF NOT EXISTS `koifw`;

-- Table: Characters
CREATE TABLE IF NOT EXISTS `characters` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `last_position` longtext DEFAULT NULL,
  `skin` longtext DEFAULT NULL,
  `is_dead` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `characters` 
  ADD PRIMARY KEY (`id`);
  
-- Table : Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL,
  `active_character_id` int(11) DEFAULT NULL,
  `banned` tinyint(1) NOT NULL DEFAULT 0,
  `banned_reason` varchar(255) DEFAULT NULL,
  `last_ip` varchar(255) DEFAULT NULL,
  `last_login` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `active_character_id` (`active_character_id`),
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`active_character_id`) REFERENCES `characters` (`id`);

  