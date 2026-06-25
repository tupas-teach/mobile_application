-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 22, 2026 at 07:42 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `flexzone_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_chat_messages`
--

CREATE TABLE `tb_chat_messages` (
  `cmid` int(100) NOT NULL,
  `clid` int(200) NOT NULL,
  `uid` int(200) NOT NULL,
  `senderType` enum('user','coach','admin') NOT NULL,
  `content` text NOT NULL,
  `isRead` tinyint(1) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_chat_threads`
--

CREATE TABLE `tb_chat_threads` (
  `clid` int(100) NOT NULL,
  `cid` int(200) NOT NULL,
  `uid` int(100) NOT NULL,
  `message` text NOT NULL,
  `unreadCount` int(11) NOT NULL,
  `notification` tinyint(1) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_coaches`
--

CREATE TABLE `tb_coaches` (
  `cid` int(255) NOT NULL,
  `uid` int(255) NOT NULL,
  `specialties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specialties`)),
  `experience` varchar(100) NOT NULL,
  `bio` text DEFAULT NULL,
  `sessionRate` decimal(10,2) DEFAULT NULL,
  `available` tinyint(1) DEFAULT NULL,
  `color` varchar(10) NOT NULL,
  `initials` varchar(5) NOT NULL,
  `rating` decimal(10,2) NOT NULL,
  `reviewCount` int(10) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updetedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_coach_application`
--

CREATE TABLE `tb_coach_application` (
  `caid` int(100) NOT NULL,
  `applicantName` varchar(200) NOT NULL,
  `applicantEmail` varchar(100) NOT NULL,
  `applicantPhone` varchar(100) NOT NULL,
  `expected` decimal(10,2) NOT NULL,
  `specialties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`specialties`)),
  `bio` text NOT NULL,
  `experience` varchar(200) NOT NULL,
  `status` enum('pending','reviewing','approved','rejected') DEFAULT NULL,
  `submittedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_courts`
--

CREATE TABLE `tb_courts` (
  `crid` int(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('Basketball','Volleyball','Badminton','Pickleball','TableTennis','Multi-purpose') NOT NULL,
  `pricePerhr` decimal(10,2) NOT NULL,
  `capacity` int(20) NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`features`)),
  `available` tinyint(1) NOT NULL,
  `imageEmoji` varchar(200) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_court_booking`
--

CREATE TABLE `tb_court_booking` (
  `cbid` int(100) NOT NULL,
  `crid` int(200) NOT NULL,
  `uid` int(100) NOT NULL,
  `timeslot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`timeslot`)),
  `totalprice` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') NOT NULL,
  `paymentStatus` enum('unpaid','paid','refunded') NOT NULL,
  `paymentMethod` enum('gcash','maya','credit_card','cash') NOT NULL,
  `guestcount` int(100) NOT NULL,
  `notes` text NOT NULL,
  `bookedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_equipment`
--

CREATE TABLE `tb_equipment` (
  `eid` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `location` varchar(200) NOT NULL,
  `total` int(20) NOT NULL,
  `available` int(20) NOT NULL,
  `status` enum('Available','In Use','Maintenance') NOT NULL,
  `usagePct` int(10) NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_ event_packages`
--

CREATE TABLE `tb_ event_packages` (
  `epid` int(100) NOT NULL,
  `name` varchar(200) NOT NULL,
  `type` enum('Birthday Party','Reunion','Christmas Party','Corporate Event','Wedding Reception','Other Even') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `hours` varchar(20) NOT NULL,
  `maxGuest` int(11) NOT NULL,
  `inclusion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`inclusion`)),
  `emoji` varchar(10) NOT NULL,
  `color` varchar(10) NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_gym_sessions`
--

CREATE TABLE `tb_gym_sessions` (
  `gsid` int(100) NOT NULL,
  `type` enum('HIIT','Yoga','Boxing','Strength','Cardio','Full Body') NOT NULL,
  `name` varchar(100) NOT NULL,
  `cid` int(100) NOT NULL,
  `startTime` time NOT NULL,
  `duration` int(45) NOT NULL,
  `capacity` int(12) NOT NULL,
  `enrolled` int(11) NOT NULL,
  `intensity` enum('low','medium','high','') NOT NULL,
  `color` varchar(20) NOT NULL,
  `isActive` tinytext NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_membership`
--

CREATE TABLE `tb_membership` (
  `mid` int(250) NOT NULL,
  `uid` int(250) NOT NULL,
  `tier` enum('basic','premium','vip','') NOT NULL,
  `monthlyFee` decimal(10,2) NOT NULL,
  `startDate` date NOT NULL,
  `renewalDate` date NOT NULL,
  `autoRenew` tinytext NOT NULL,
  `status` enum('active','expired','cancelled','paused') NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_notifications`
--

CREATE TABLE `tb_notifications` (
  `nid` int(100) NOT NULL,
  `uid` int(100) NOT NULL,
  `type` enum('booking','payment','promo','reminder','system') NOT NULL,
  `title` varchar(200) NOT NULL,
  `body` text NOT NULL,
  `isRead` tinyint(1) NOT NULL,
  `referenceId` varchar(250) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_products`
--

CREATE TABLE `tb_products` (
  `pid` int(100) NOT NULL,
  `name` varchar(200) NOT NULL,
  `category` enum('Supplements','Apparel','Equipment','Court Gear','Beverages','Accessories') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `instock` tinyint(1) NOT NULL,
  `popular` tinyint(1) NOT NULL,
  `imageEmoji` varchar(20) NOT NULL,
  `description` text NOT NULL,
  `rating` decimal(10,2) NOT NULL,
  `reviewcount` int(11) NOT NULL,
  `forgym` tinyint(1) NOT NULL,
  `forcourt` tinytext NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_session_bookings`
--

CREATE TABLE `tb_session_bookings` (
  `sbid` int(100) NOT NULL,
  `gsid` int(100) NOT NULL,
  `uid` int(100) NOT NULL,
  `status` enum('confirmed','cancelled','attended') NOT NULL,
  `bookedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `CancelledAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_transaction`
--

CREATE TABLE `tb_transaction` (
  `tid` int(100) NOT NULL,
  `uid` int(200) NOT NULL,
  `type` varchar(255) NOT NULL,
  `referenceId` decimal(10,2) NOT NULL,
  `amount` varchar(255) NOT NULL,
  `currency` varchar(55) NOT NULL,
  `paymentMethod` enum('gcash','maya','credit_card','cash') NOT NULL,
  `staus` enum('pending','paid','failed','refunded') NOT NULL,
  `referenceNo` varchar(255) NOT NULL,
  `description` varchar(200) NOT NULL,
  `paidAt` datetime NOT NULL,
  `refundedAt` datetime NOT NULL,
  `refundReason` varchar(200) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_users`
--

CREATE TABLE `tb_users` (
  `uid` int(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `ProfilePhoto` varchar(50) NOT NULL,
  `rewardPoints` int(11) NOT NULL,
  `Notification` tinyint(1) NOT NULL,
  `them` enum('light','dark','','') NOT NULL,
  `role` enum('member','coach','admin','') NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_chat_messages`
--
ALTER TABLE `tb_chat_messages`
  ADD PRIMARY KEY (`cmid`),
  ADD KEY `fk_message_thread` (`clid`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `tb_chat_threads`
--
ALTER TABLE `tb_chat_threads`
  ADD PRIMARY KEY (`clid`),
  ADD KEY `fk_chat_coach` (`cid`),
  ADD KEY `fk_chat_user` (`uid`);

--
-- Indexes for table `tb_coaches`
--
ALTER TABLE `tb_coaches`
  ADD PRIMARY KEY (`cid`),
  ADD KEY `fk_coaches_uid` (`uid`);

--
-- Indexes for table `tb_coach_application`
--
ALTER TABLE `tb_coach_application`
  ADD PRIMARY KEY (`caid`);

--
-- Indexes for table `tb_courts`
--
ALTER TABLE `tb_courts`
  ADD PRIMARY KEY (`crid`);

--
-- Indexes for table `tb_court_booking`
--
ALTER TABLE `tb_court_booking`
  ADD PRIMARY KEY (`cbid`),
  ADD KEY `fk_cb_court` (`crid`),
  ADD KEY `fk_cb_user` (`uid`);

--
-- Indexes for table `tb_equipment`
--
ALTER TABLE `tb_equipment`
  ADD PRIMARY KEY (`eid`);

--
-- Indexes for table `tb_ event_packages`
--
ALTER TABLE `tb_ event_packages`
  ADD PRIMARY KEY (`epid`);

--
-- Indexes for table `tb_gym_sessions`
--
ALTER TABLE `tb_gym_sessions`
  ADD PRIMARY KEY (`gsid`),
  ADD KEY `fk_gymsession_coach` (`cid`);

--
-- Indexes for table `tb_membership`
--
ALTER TABLE `tb_membership`
  ADD PRIMARY KEY (`mid`),
  ADD KEY `fk_membership_user` (`uid`);

--
-- Indexes for table `tb_notifications`
--
ALTER TABLE `tb_notifications`
  ADD PRIMARY KEY (`nid`),
  ADD KEY `fk_notification_user` (`uid`);

--
-- Indexes for table `tb_products`
--
ALTER TABLE `tb_products`
  ADD PRIMARY KEY (`pid`);

--
-- Indexes for table `tb_session_bookings`
--
ALTER TABLE `tb_session_bookings`
  ADD PRIMARY KEY (`sbid`),
  ADD KEY `fk_sb_session` (`gsid`),
  ADD KEY `fk_sb_user` (`uid`);

--
-- Indexes for table `tb_transaction`
--
ALTER TABLE `tb_transaction`
  ADD PRIMARY KEY (`tid`);

--
-- Indexes for table `tb_users`
--
ALTER TABLE `tb_users`
  ADD PRIMARY KEY (`uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_chat_messages`
--
ALTER TABLE `tb_chat_messages`
  MODIFY `cmid` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_chat_threads`
--
ALTER TABLE `tb_chat_threads`
  MODIFY `clid` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_coaches`
--
ALTER TABLE `tb_coaches`
  MODIFY `cid` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_coach_application`
--
ALTER TABLE `tb_coach_application`
  MODIFY `caid` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_courts`
--
ALTER TABLE `tb_courts`
  MODIFY `crid` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_court_booking`
--
ALTER TABLE `tb_court_booking`
  MODIFY `cbid` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_equipment`
--
ALTER TABLE `tb_equipment`
  MODIFY `eid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_ event_packages`
--
ALTER TABLE `tb_ event_packages`
  MODIFY `epid` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_gym_sessions`
--
ALTER TABLE `tb_gym_sessions`
  MODIFY `gsid` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_membership`
--
ALTER TABLE `tb_membership`
  MODIFY `mid` int(250) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_notifications`
--
ALTER TABLE `tb_notifications`
  MODIFY `nid` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_products`
--
ALTER TABLE `tb_products`
  MODIFY `pid` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_session_bookings`
--
ALTER TABLE `tb_session_bookings`
  MODIFY `sbid` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_transaction`
--
ALTER TABLE `tb_transaction`
  MODIFY `tid` int(100) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_chat_messages`
--
ALTER TABLE `tb_chat_messages`
  ADD CONSTRAINT `fk_message_thread` FOREIGN KEY (`clid`) REFERENCES `tb_chat_threads` (`clid`),
  ADD CONSTRAINT `fk_message_user` FOREIGN KEY (`uid`) REFERENCES `tb_users` (`uid`),
  ADD CONSTRAINT `tb_chat_messages_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `tb_users` (`uid`);

--
-- Constraints for table `tb_chat_threads`
--
ALTER TABLE `tb_chat_threads`
  ADD CONSTRAINT `fk_chat_coach` FOREIGN KEY (`cid`) REFERENCES `tb_coaches` (`cid`),
  ADD CONSTRAINT `fk_chat_user` FOREIGN KEY (`uid`) REFERENCES `tb_users` (`uid`);

--
-- Constraints for table `tb_coaches`
--
ALTER TABLE `tb_coaches`
  ADD CONSTRAINT `fk_coaches_uid` FOREIGN KEY (`uid`) REFERENCES `tb_users` (`uid`);

--
-- Constraints for table `tb_court_booking`
--
ALTER TABLE `tb_court_booking`
  ADD CONSTRAINT `fk_cb_court` FOREIGN KEY (`crid`) REFERENCES `tb_courts` (`crid`),
  ADD CONSTRAINT `fk_cb_user` FOREIGN KEY (`uid`) REFERENCES `tb_users` (`uid`);

--
-- Constraints for table `tb_gym_sessions`
--
ALTER TABLE `tb_gym_sessions`
  ADD CONSTRAINT `fk_gymsession_coach` FOREIGN KEY (`cid`) REFERENCES `tb_coaches` (`cid`);

--
-- Constraints for table `tb_membership`
--
ALTER TABLE `tb_membership`
  ADD CONSTRAINT `fk_membership_user` FOREIGN KEY (`uid`) REFERENCES `tb_users` (`uid`);

--
-- Constraints for table `tb_notifications`
--
ALTER TABLE `tb_notifications`
  ADD CONSTRAINT `fk_notification_user` FOREIGN KEY (`uid`) REFERENCES `tb_users` (`uid`);

--
-- Constraints for table `tb_session_bookings`
--
ALTER TABLE `tb_session_bookings`
  ADD CONSTRAINT `fk_sb_session` FOREIGN KEY (`gsid`) REFERENCES `tb_gym_sessions` (`gsid`),
  ADD CONSTRAINT `fk_sb_user` FOREIGN KEY (`uid`) REFERENCES `tb_users` (`uid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
