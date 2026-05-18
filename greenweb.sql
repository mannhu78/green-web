-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 18, 2026 at 02:20 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `greenweb`
--

-- --------------------------------------------------------

--
-- Table structure for table `analyze_history`
--

CREATE TABLE `analyze_history` (
  `id` int NOT NULL,
  `user_email` varchar(120) NOT NULL,
  `url` varchar(500) NOT NULL,
  `performance_score` int DEFAULT NULL,
  `co2` float DEFAULT NULL,
  `green_label` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT (now())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `analyze_history`
--

INSERT INTO `analyze_history` (`id`, `user_email`, `url`, `performance_score`, `co2`, `green_label`, `created_at`) VALUES
(1, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 69, 0.3303, 'green', '2026-05-14 14:16:48'),
(2, 'mannhu593@gmail.com', 'https://cntt.ntt.edu.vn/', 59, 0.2938, 'green', '2026-05-14 14:18:58'),
(3, 'mannhu593@gmail.com', 'https://github.com/', 83, 0.1526, 'green', '2026-05-14 17:51:07'),
(4, 'mannhu593@gmail.com', 'https://www.youtube.com/', 65, 0.177, 'green', '2026-05-14 17:52:51'),
(5, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 64, 0.3355, 'green', '2026-05-14 17:54:07'),
(6, 'mannhu593@gmail.com', 'https://upsharework.com/vi', 70, 0.1875, 'green', '2026-05-14 17:56:22'),
(7, 'mannhu593@gmail.com', 'https://upsharework.com/', 70, 0.2124, 'green', '2026-05-14 18:06:57'),
(8, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 51, 0.3305, 'green', '2026-05-14 18:09:18'),
(9, 'mannhu593@gmail.com', 'https://upsharework.com/', 69, 0.1833, 'green', '2026-05-14 18:13:17'),
(10, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 61, 0.3355, 'green', '2026-05-14 18:21:14'),
(11, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 76, 0.3165, 'green', '2026-05-14 18:23:40'),
(12, 'mannhu593@gmail.com', 'https://upsharework.com/', 55, 0.2184, 'green', '2026-05-14 18:29:20'),
(13, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 61, 0.3355, 'green', '2026-05-14 18:33:56'),
(14, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 81, 0.336, 'heavy', '2026-05-16 16:03:52'),
(15, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 81, 0.3311, 'heavy', '2026-05-16 16:14:28'),
(16, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 79, 0.336, 'heavy', '2026-05-16 23:29:30'),
(17, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 79, 0.331, 'heavy', '2026-05-16 23:46:15'),
(18, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 76, 0.3311, 'heavy', '2026-05-16 23:56:23'),
(19, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 78, 0.318, 'heavy', '2026-05-17 00:25:50'),
(20, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 82, 0.331, 'heavy', '2026-05-17 00:32:23'),
(21, 'mannhu593@gmail.com', 'https://dichvucong.bocongan.gov.vn/?home=1', 99, 0.0808, 'heavy', '2026-05-17 16:40:51'),
(22, 'mannhu593@gmail.com', 'https://dichvucong.bocongan.gov.vn/?home=1', 81, 0.0808, 'green', '2026-05-17 17:04:58'),
(23, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 55, 0.331, 'moderate', '2026-05-17 17:06:36'),
(24, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 75, 0.331, 'moderate', '2026-05-17 17:10:39'),
(25, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 81, 0.331, 'moderate', '2026-05-17 23:13:04'),
(26, 'mannhu593@gmail.com', 'https://baomoi.com/', 98, 0.0699, 'green', '2026-05-18 13:20:25'),
(27, 'mannhu593@gmail.com', 'https://baomoi.com/', 97, 0.0643, 'green', '2026-05-18 13:46:20'),
(28, 'mannhu593@gmail.com', 'https://baomoi.com/', 97, 0.0767, 'green', '2026-05-18 14:43:04'),
(29, 'mannhu593@gmail.com', 'https://baomoi.com/', 98, 0.0863, 'green', '2026-05-18 14:54:53'),
(30, 'mannhu593@gmail.com', 'https://vnexpress.net/', 44, 0.2377, 'moderate', '2026-05-18 15:08:42'),
(31, 'mannhu593@gmail.com', 'https://vnexpress.net/', 68, 0.2331, 'moderate', '2026-05-18 15:16:20'),
(32, 'mannhu593@gmail.com', 'https://vnexpress.net/', 65, 0.2494, 'moderate', '2026-05-18 15:27:56'),
(33, 'mannhu593@gmail.com', 'https://vnexpress.net/', 65, 0.2709, 'moderate', '2026-05-18 15:37:57'),
(34, 'mannhu593@gmail.com', 'https://ntt.edu.vn/', 77, 0.3369, 'moderate', '2026-05-18 15:43:09'),
(35, 'mannhu593@gmail.com', 'https://dichvucong.bocongan.gov.vn/?home=1', 96, 0.0808, 'green', '2026-05-18 16:05:43'),
(36, 'mannhu593@gmail.com', 'https://www.youtube.com/', 65, 0.1776, 'moderate', '2026-05-18 16:07:43'),
(37, 'mannhu593@gmail.com', 'https://vnexpress.net/', 74, 0.2194, 'moderate', '2026-05-18 19:58:44'),
(38, 'mannhu593@gmail.com', 'https://vnexpress.net/', 63, 0.231, 'moderate', '2026-05-18 20:37:46');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(120) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expire` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`, `google_id`, `avatar`, `created_at`, `reset_token`, `reset_token_expire`) VALUES
(1, 'Mẫn Như', 'mannhu593@gmail.com', '$2b$12$7SlmrEqPTF.oV/PmvXnEj.A/Y4x0BKHCyZcg.tOfkQfOW7.ELGrFK', NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJ4nRg1-VelWJWOuXtH_oQclyqaT5ZIyIfk8GhpO39cnPSOIX4Jlw=s96-c', '2026-05-14 12:41:33', NULL, NULL),
(2, NULL, '2200005295@nttu.edu.vn', '$2b$12$3t0CauNR7AEIURRTRV8iC.4lkTk7K2iO4hjr5AHgouZE02sYHc7ey', NULL, NULL, '2026-05-14 15:04:37', NULL, NULL),
(4, 'phú thanh', '2200009943@nttu.edu.vn', '$2b$12$Ts67PhXOK9mw1kUNGbc7JevN9wIbPmQFgZFXsBdyWvrxiudzFYiWy', NULL, NULL, '2026-05-14 16:06:28', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `analyze_history`
--
ALTER TABLE `analyze_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `analyze_history`
--
ALTER TABLE `analyze_history`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
