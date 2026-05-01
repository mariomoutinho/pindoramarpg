-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 02/05/2026 às 01:30
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: ` pindorama_rpg`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `fichas`
--

CREATE TABLE `fichas` (
  `id` int(11) NOT NULL,
  `participante` varchar(150) DEFAULT NULL,
  `personagem` varchar(150) DEFAULT NULL,
  `ancestralidade` varchar(100) DEFAULT NULL,
  `origem` varchar(100) DEFAULT NULL,
  `classe` varchar(100) DEFAULT NULL,
  `nivel` int(11) DEFAULT 1,
  `divindade` varchar(100) DEFAULT NULL,
  `personagem_imagem` varchar(255) DEFAULT NULL,
  `forca` int(11) DEFAULT 0,
  `destreza` int(11) DEFAULT 0,
  `constituicao` int(11) DEFAULT 0,
  `inteligencia` int(11) DEFAULT 0,
  `sabedoria` int(11) DEFAULT 0,
  `carisma` int(11) DEFAULT 0,
  `pv_total` int(11) DEFAULT 0,
  `pv_atuais` int(11) DEFAULT 0,
  `pm_total` int(11) DEFAULT 0,
  `pm_atuais` int(11) DEFAULT 0,
  `defesa_total` int(11) DEFAULT 10,
  `defesa_destreza` int(11) DEFAULT 0,
  `defesa_armadura` int(11) DEFAULT 0,
  `defesa_escudo` int(11) DEFAULT 0,
  `defesa_outros` int(11) DEFAULT 0,
  `armadura_escudo` text DEFAULT NULL,
  `proficiencias` text DEFAULT NULL,
  `habilidades_magias` text DEFAULT NULL,
  `equipamentos` text DEFAULT NULL,
  `ataques` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ataques`)),
  `pericias` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`pericias`)),
  `dinheiro` varchar(50) DEFAULT NULL,
  `carga` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `fichas`
--
ALTER TABLE `fichas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `fichas`
--
ALTER TABLE `fichas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
