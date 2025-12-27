-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 25, 2025 at 04:58 PM
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
-- Database: `finance_dashboard`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `type` enum('income','expense') NOT NULL,
  `color` varchar(7) DEFAULT '#3498db',
  `is_default` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `user_id`, `name`, `type`, `color`, `is_default`) VALUES
(1, NULL, 'Salary', 'income', '#3498db', 1),
(2, NULL, 'Freelance', 'income', '#3498db', 1),
(3, NULL, 'Investment', 'income', '#3498db', 1),
(4, NULL, 'Gift', 'income', '#3498db', 1),
(5, NULL, 'Other Income', 'income', '#3498db', 1),
(6, NULL, 'Food & Dining', 'expense', '#3498db', 1),
(7, NULL, 'Transportation', 'expense', '#3498db', 1),
(8, NULL, 'Shopping', 'expense', '#3498db', 1),
(9, NULL, 'Entertainment', 'expense', '#3498db', 1),
(10, NULL, 'Bills & Utilities', 'expense', '#3498db', 1),
(11, NULL, 'Healthcare', 'expense', '#3498db', 1),
(12, NULL, 'Education', 'expense', '#3498db', 1),
(13, NULL, 'Other Expense', 'expense', '#3498db', 1),
(14, 1, 'Salary', 'income', '#2ecc71', 0),
(15, 1, 'Freelance', 'income', '#3498db', 0),
(16, 1, 'Investment', 'income', '#9b59b6', 0),
(17, 1, 'Food & Dining', 'expense', '#e74c3c', 0),
(18, 1, 'Transportation', 'expense', '#f39c12', 0),
(19, 1, 'Shopping', 'expense', '#d35400', 0),
(20, 1, 'Entertainment', 'expense', '#8e44ad', 0),
(21, 1, 'Bills & Utilities', 'expense', '#34495e', 0),
(22, 1, 'Healthcare', 'expense', '#16a085', 0),
(23, 2, 'Salary', 'income', '#2ecc71', 0),
(24, 2, 'Freelance', 'income', '#3498db', 0),
(25, 2, 'Investment', 'income', '#9b59b6', 0),
(26, 2, 'Food & Dining', 'expense', '#e74c3c', 0),
(27, 2, 'Transportation', 'expense', '#f39c12', 0),
(28, 2, 'Shopping', 'expense', '#d35400', 0),
(29, 2, 'Entertainment', 'expense', '#8e44ad', 0),
(30, 2, 'Bills & Utilities', 'expense', '#34495e', 0),
(31, 2, 'Healthcare', 'expense', '#16a085', 0),
(32, 3, 'Salary', 'income', '#2ecc71', 0),
(33, 3, 'Freelance', 'income', '#3498db', 0),
(34, 3, 'Investment', 'income', '#9b59b6', 0),
(35, 3, 'Food & Dining', 'expense', '#e74c3c', 0),
(36, 3, 'Transportation', 'expense', '#f39c12', 0),
(37, 3, 'Shopping', 'expense', '#d35400', 0),
(38, 3, 'Entertainment', 'expense', '#8e44ad', 0),
(39, 3, 'Bills & Utilities', 'expense', '#34495e', 0),
(40, 3, 'Healthcare', 'expense', '#16a085', 0);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` enum('income','expense') NOT NULL,
  `description` text DEFAULT NULL,
  `transaction_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `category_id`, `amount`, `type`, `description`, `transaction_date`, `created_at`) VALUES
(1, 1, 15, 55.00, 'income', 'Test ', '2026-10-12', '2025-12-06 07:50:33'),
(2, 2, 24, 100.00, 'income', 'Creative writing', '2025-12-07', '2025-12-08 16:18:08'),
(3, 2, 26, 8.00, 'expense', 'Food and dining', '2025-12-08', '2025-12-08 16:27:35'),
(4, 2, 29, 5.00, 'expense', 'entertainment', '2025-12-08', '2025-12-08 16:28:04');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `created_at`, `updated_at`) VALUES
(1, 'girisha2536', 'girisha2536@gmail.com', '$2a$10$XxNiPDaPAlvM5AgcEMaacu/So8r.m3qq.vsiwBJ/nCnnkr6aHdjEW', '2025-12-06 07:49:50', '2025-12-06 07:49:50'),
(2, 'Sara', 'saracozy7@gmail.com', '$2a$10$zHEk/bkpQd4/C987.BCpX.HDfEMF6T9rUV5X1MRBz1Tw4rwKdo1.S', '2025-12-06 07:51:28', '2025-12-06 07:51:28'),
(3, 'girisha25', 'giri12345@gmail.com', '$2a$10$ZlNkz9jsgAtIzTqOy1uspe3tPl/rCQxVi5ury8iCnJ1J.onVthWuW', '2025-12-08 16:24:11', '2025-12-08 16:24:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_category` (`user_id`,`name`,`type`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `idx_transactions_user_date` (`user_id`,`transaction_date`),
  ADD KEY `idx_transactions_user_type` (`user_id`,`type`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
