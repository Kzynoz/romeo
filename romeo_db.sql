-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Feb 14, 2025 at 05:55 PM
-- Server version: 8.0.40
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `romeo_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `care`
--

CREATE TABLE `care` (
  `id` int UNSIGNED NOT NULL,
  `performed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `practitioner_id` int UNSIGNED DEFAULT '1',
  `customer_id` int UNSIGNED DEFAULT NULL,
  `type` enum('soin pédicure','bilan podologique et orthèse plantaire') NOT NULL,
  `complements` varchar(150) DEFAULT NULL,
  `price` decimal(6,2) NOT NULL,
  `invoice_paid` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `invoice_send` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `invoice_generated` tinyint UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `care`
--

INSERT INTO `care` (`id`, `performed_at`, `practitioner_id`, `customer_id`, `type`, `complements`, `price`, `invoice_paid`, `invoice_send`, `invoice_generated`) VALUES
(1, '2025-02-12 12:25:06', 1, 2, 'soin pédicure', 'rien à signaler', 36.00, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id` int UNSIGNED NOT NULL,
  `title` enum('m.','mme') NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(150) NOT NULL,
  `phone` char(10) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` char(60) DEFAULT NULL,
  `is_patient` tinyint UNSIGNED NOT NULL DEFAULT '1',
  `guardian_id` int UNSIGNED DEFAULT NULL,
  `practitioner_id` int UNSIGNED DEFAULT NULL,
  `retirement_home_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `title`, `firstname`, `lastname`, `phone`, `email`, `password`, `is_patient`, `guardian_id`, `practitioner_id`, `retirement_home_id`) VALUES
(1, 'm.', 'johnny', 'doe', '0789845780', 'john.doe@gmail.com', NULL, 0, NULL, NULL, NULL),
(2, 'mme', 'jeanette', 'doe', NULL, NULL, NULL, 1, 1, 1, 6),
(3, 'mme', 'janna', 'laura', '0789845780', NULL, NULL, 1, 1, 1, 6),
(16, 'm.', 'a', 'bellet', NULL, NULL, NULL, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `guardian`
--

CREATE TABLE `guardian` (
  `id` int UNSIGNED NOT NULL,
  `customer_id` int UNSIGNED NOT NULL,
  `relationship` enum('parent','légal','famille','société') NOT NULL,
  `company` varchar(150) DEFAULT NULL,
  `street` varchar(150) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `zip_code` char(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `guardian`
--

INSERT INTO `guardian` (`id`, `customer_id`, `relationship`, `company`, `street`, `city`, `zip_code`) VALUES
(5, 16, 'société', 'gérance vieux', NULL, NULL, NULL),
(6, 1, 'société', 'test', '30 rue de brooklyn', 'new-york', '65005');

-- --------------------------------------------------------

--
-- Table structure for table `log`
--

CREATE TABLE `log` (
  `id` int UNSIGNED NOT NULL,
  `action` enum('created','updated','deleted') NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `old_values` json DEFAULT NULL,
  `practitioner_id` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `log`
--

INSERT INTO `log` (`id`, `action`, `created_at`, `old_values`, `practitioner_id`) VALUES
(1, 'created', '2025-02-12 12:21:14', '{\"name\": \"dédé\", \"table\": \"practitioner\"}', 1);

-- --------------------------------------------------------

--
-- Table structure for table `practitioner`
--

CREATE TABLE `practitioner` (
  `id` int UNSIGNED NOT NULL,
  `alias` varchar(50) NOT NULL,
  `password` char(60) NOT NULL,
  `email` varchar(150) NOT NULL,
  `is_admin` tinyint UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `practitioner`
--

INSERT INTO `practitioner` (`id`, `alias`, `password`, `email`, `is_admin`) VALUES
(1, 'julien', '$2b$10$21jRc30Cukqj7w0skQbhgO7s9v/Plb3nsLOSf2OnEnENgcER9gBV.', 'j.belletofi@gmail.com', 1),
(4, 'margot', '$2b$10$XjBA6.fUIbj2uiJ9ICVFfuYyeJ9UWXjQXnX17376p7uORPvKR8yq6', 'margot.brillon@orange.fr', 0);

-- --------------------------------------------------------

--
-- Table structure for table `retirement_home`
--

CREATE TABLE `retirement_home` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `contact` varchar(150) DEFAULT NULL,
  `street` varchar(150) NOT NULL,
  `city` varchar(100) NOT NULL,
  `zip_code` char(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `retirement_home`
--

INSERT INTO `retirement_home` (`id`, `name`, `contact`, `street`, `city`, `zip_code`) VALUES
(6, 'l\'ile barbe', 'roger didier', '57 rue de la charité', 'lyon', '69009'),
(7, 'l\'étang des hauts lyonnais', 'amelie', '26 rue pierre robin', 'lyon', '69006');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `care`
--
ALTER TABLE `care`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `practitioner_id` (`practitioner_id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `practitioner_id` (`practitioner_id`),
  ADD KEY `retirement_home_id` (`retirement_home_id`),
  ADD KEY `customer_ibfk_1` (`guardian_id`);

--
-- Indexes for table `guardian`
--
ALTER TABLE `guardian`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `log`
--
ALTER TABLE `log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `practitioner_id` (`practitioner_id`);

--
-- Indexes for table `practitioner`
--
ALTER TABLE `practitioner`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `alias` (`alias`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `retirement_home`
--
ALTER TABLE `retirement_home`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `care`
--
ALTER TABLE `care`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `guardian`
--
ALTER TABLE `guardian`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `log`
--
ALTER TABLE `log`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `practitioner`
--
ALTER TABLE `practitioner`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `retirement_home`
--
ALTER TABLE `retirement_home`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `care`
--
ALTER TABLE `care`
  ADD CONSTRAINT `care_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  ADD CONSTRAINT `care_ibfk_2` FOREIGN KEY (`practitioner_id`) REFERENCES `practitioner` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`guardian_id`) REFERENCES `customer` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  ADD CONSTRAINT `customer_ibfk_2` FOREIGN KEY (`practitioner_id`) REFERENCES `practitioner` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  ADD CONSTRAINT `customer_ibfk_3` FOREIGN KEY (`retirement_home_id`) REFERENCES `retirement_home` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

--
-- Constraints for table `guardian`
--
ALTER TABLE `guardian`
  ADD CONSTRAINT `guardian_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `log`
--
ALTER TABLE `log`
  ADD CONSTRAINT `log_ibfk_1` FOREIGN KEY (`practitioner_id`) REFERENCES `practitioner` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
