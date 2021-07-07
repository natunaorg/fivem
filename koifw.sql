-- phpMyAdmin SQL Dump
-- version 5.1.0-rc1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 07, 2021 at 12:50 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `koifw`
--

-- --------------------------------------------------------

--
-- Table structure for table `characters`
--

CREATE TABLE `characters` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `last_position` longtext DEFAULT NULL,
  `skin` longtext DEFAULT NULL,
  `is_dead` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `characters`
--

INSERT INTO `characters` (`id`, `first_name`, `last_name`, `last_position`, `skin`, `is_dead`) VALUES
(1, 'Haden', 'Hayes', '-410.50634765625,-1062.9671630859375,71.28256225585938', '{\"chin_1\":0,\"bodyb_4\":100,\"sun_1\":255,\"neckarm_1\":0,\"ears_1\":-1,\"blemishes_2\":100,\"blush_1\":255,\"hair_1\":39,\"nose_1\":0,\"makeup_type\":0,\"chin_3\":0,\"moles_2\":100,\"beard_2\":100,\"bags_2\":0,\"cheeks_3\":0,\"decals_1\":0,\"bodyb_3\":255,\"complexion_1\":255,\"chest_2\":100,\"nose_2\":0,\"complexion_2\":100,\"bodyb_1\":255,\"mom\":23,\"eyebrows_5\":0,\"bodyb_2\":100,\"eyebrows_3\":0,\"nose_5\":0,\"decals_2\":0,\"moles_1\":255,\"chest_3\":0,\"neck_thickness\":0,\"tshirt_2\":2,\"torso_2\":0,\"sun_2\":100,\"lipstick_2\":100,\"lefthand_2\":0,\"shoes_1\":21,\"hair_color_2\":0,\"cheeks_2\":0,\"beard_3\":0,\"skin_md_weight\":81,\"makeup_4\":255,\"chin_2\":0,\"pants_1\":78,\"nose_4\":0,\"pants_2\":4,\"makeup_1\":255,\"hair_2\":0,\"shoes_2\":9,\"age_2\":100,\"helmet_1\":-1,\"lipstick_4\":0,\"lipstick_1\":255,\"jaw_2\":0,\"lefthand_1\":-1,\"eyebrows_4\":0,\"neckarm_2\":0,\"arms_2\":0,\"lipstick_3\":0,\"helmet_2\":0,\"age_1\":255,\"beard_4\":0,\"chin_4\":0,\"glasses_2\":3,\"face_md_weight\":49,\"dad\":0,\"blemishes_1\":255,\"torso_1\":20,\"mask_2\":0,\"sex\":0,\"bproof_2\":0,\"eye_squint\":0,\"beard_1\":255,\"eyebrows_1\":0,\"blush_3\":0,\"eyebrows_6\":0,\"chest_4\":0,\"arms\":12,\"eye_color\":0,\"bags_1\":0,\"glasses_1\":17,\"eyebrows_2\":100,\"nose_3\":0,\"mask_1\":0,\"righthand_1\":-1,\"cheeks_1\":0,\"makeup_3\":255,\"righthand_2\":0,\"hair_color_1\":10,\"tshirt_1\":21,\"makeup_2\":100,\"ears_2\":0,\"jaw_1\":0,\"blush_2\":100,\"chest_1\":255,\"lip_thickness\":0,\"nose_6\":0,\"bproof_1\":0}', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `active_character_id` int(11) DEFAULT NULL,
  `banned` tinyint(1) NOT NULL DEFAULT 0,
  `banned_reason` varchar(255) DEFAULT NULL,
  `last_ip` varchar(255) DEFAULT NULL,
  `last_login` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `active_character_id`, `banned`, `banned_reason`, `last_ip`, `last_login`) VALUES
(76561198290395137, 1, 0, NULL, '192.168.1.5', '7/3/2021, 6:23:32 PM');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `characters`
--
ALTER TABLE `characters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `active_character_id` (`active_character_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `characters`
--
ALTER TABLE `characters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76561198290395138;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`active_character_id`) REFERENCES `characters` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
