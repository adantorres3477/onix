-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 20-10-2026 a las 17:05:34
-- Versión del servidor: 8.0.43
-- Versión de PHP: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `onix`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `coleccion`
--

CREATE TABLE `coleccion` (
  `id_coleccion` int NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb3_spanish_ci NOT NULL,
  `descripción` varchar(150) COLLATE utf8mb3_spanish_ci NOT NULL,
  `temporada` varchar(20) COLLATE utf8mb3_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contiene`
--

CREATE TABLE `contiene` (
  `id_contiene` int NOT NULL,
  `id_pedido` int NOT NULL,
  `id_producto` int NOT NULL,
  `perfil` varchar(20) COLLATE utf8mb3_spanish_ci NOT NULL,
  `cantidad` int NOT NULL,
  `talla` varchar(150) COLLATE utf8mb3_spanish_ci NOT NULL,
  `color` varchar(150) COLLATE utf8mb3_spanish_ci NOT NULL,
  `precio unitario` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `onix`
--

CREATE TABLE `onix` (
  `id` int NOT NULL,
  `correo` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `clave` varchar(200) NOT NULL,
  `perfil` char(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `id_pedido` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha` date NOT NULL,
  `total` float NOT NULL,
  `estado de seguimiento` varchar(150) COLLATE utf8mb3_spanish_ci NOT NULL,
  `dirección de envío` varchar(200) COLLATE utf8mb3_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pertenece`
--

CREATE TABLE `pertenece` (
  `id_pertenece` int NOT NULL,
  `id_producto` int NOT NULL,
  `id_coleccion` int NOT NULL,
  `perfil` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` int NOT NULL,
  `id_coleccion` int NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb3_spanish_ci NOT NULL,
  `categoría` int NOT NULL,
  `precio` float NOT NULL,
  `tallas` int NOT NULL,
  `colores` varchar(150) COLLATE utf8mb3_spanish_ci NOT NULL,
  `stock` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `realiza`
--

CREATE TABLE `realiza` (
  `id_realiza` int NOT NULL,
  `id_usuario` int NOT NULL,
  `id_pedido` int NOT NULL,
  `perfil` varchar(20) COLLATE utf8mb3_spanish_ci NOT NULL,
  `fecha de compra` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `coleccion`
--
ALTER TABLE `coleccion`
  ADD PRIMARY KEY (`id_coleccion`);

--
-- Indices de la tabla `contiene`
--
ALTER TABLE `contiene`
  ADD PRIMARY KEY (`id_contiene`),
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `onix`
--
ALTER TABLE `onix`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `pertenece`
--
ALTER TABLE `pertenece`
  ADD PRIMARY KEY (`id_pertenece`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_coleccion` (`id_coleccion`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_coleccion` (`id_coleccion`);

--
-- Indices de la tabla `realiza`
--
ALTER TABLE `realiza`
  ADD PRIMARY KEY (`id_realiza`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_pedido` (`id_pedido`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `coleccion`
--
ALTER TABLE `coleccion`
  MODIFY `id_coleccion` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `contiene`
--
ALTER TABLE `contiene`
  MODIFY `id_contiene` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `onix`
--
ALTER TABLE `onix`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id_pedido` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pertenece`
--
ALTER TABLE `pertenece`
  MODIFY `id_pertenece` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `realiza`
--
ALTER TABLE `realiza`
  MODIFY `id_realiza` int NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pertenece`
--
ALTER TABLE `pertenece`
  ADD CONSTRAINT `pertenece_ibfk_1` FOREIGN KEY (`id_coleccion`) REFERENCES `coleccion` (`id_coleccion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`id_coleccion`) REFERENCES `coleccion` (`id_coleccion`) ON UPDATE CASCADE,
  ADD CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `pertenece` (`id_producto`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `realiza`
--
ALTER TABLE `realiza`
  ADD CONSTRAINT `realiza_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
