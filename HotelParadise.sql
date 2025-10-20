CREATE DATABASE  IF NOT EXISTS `hotel` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `hotel`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: hotel
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `buffet`
--

DROP TABLE IF EXISTS `buffet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buffet` (
  `ID` int(6) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `categoria` varchar(30) NOT NULL,
  `disponibilidad` tinyint(1) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buffet`
--

LOCK TABLES `buffet` WRITE;
/*!40000 ALTER TABLE `buffet` DISABLE KEYS */;
INSERT INTO `buffet` VALUES (1,'Agua Mineral','Agua mineral natural 500ml','bebidas',1,2.50,'/src/img/bebidas/agua-mineral.png'),(2,'Café','Café americano recién preparado','bebidas',1,3.00,'/src/img/bebidas/café.png'),(3,'Gaseosas','Variedad de gaseosas 350ml','bebidas',1,2.80,'/src/img/bebidas/gaseosas.png'),(4,'Jugo de Naranja','Jugo de naranja natural recién exprimido','bebidas',1,4.00,'/src/img/bebidas/jugo de naranja.png'),(5,'Burritos','Burritos con carne, frijoles y queso','buffet',1,8.50,'/src/img/buffet/burritos.png'),(6,'Hamburguesa','Hamburguesa completa con papas fritas','buffet',1,9.00,'/src/img/buffet/Hamburguesa.png'),(7,'Milanesa','Milanesa de carne con guarnición','buffet',1,10.00,'/src/img/buffet/milanesa.png'),(8,'Sandwich','Sandwich triple con ingredientes frescos','buffet',1,6.50,'/src/img/buffet/sandwich.png'),(9,'Pastafrola','Pastafrola de membrillo casera','postres',1,4.50,'/src/img/postres/pastafrola.png'),(10,'Postres Variados','Selección de postres del día','postres',1,5.00,'/src/img/postres/postres.png');
/*!40000 ALTER TABLE `buffet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallepedido`
--

DROP TABLE IF EXISTS `detallepedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detallepedido` (
  `cantidad` tinyint(4) DEFAULT NULL,
  `subtotal` decimal(4,2) DEFAULT NULL,
  `IDPedido` int(11) DEFAULT NULL,
  `IDBuffet` int(11) DEFAULT NULL,
  `IdDetalle` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`IdDetalle`),
  KEY `fk_buffet_idx` (`IDBuffet`),
  KEY `fk_pedido_idx` (`IDPedido`),
  CONSTRAINT `fk_buffet` FOREIGN KEY (`IDBuffet`) REFERENCES `buffet` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedido` FOREIGN KEY (`IDPedido`) REFERENCES `pedido` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallepedido`
--

LOCK TABLES `detallepedido` WRITE;
/*!40000 ALTER TABLE `detallepedido` DISABLE KEYS */;
INSERT INTO `detallepedido` VALUES (1,9.00,1,6,1),(1,8.50,2,5,2),(1,8.50,3,5,3),(1,10.00,4,7,4),(1,9.00,4,6,5);
/*!40000 ALTER TABLE `detallepedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habitacion`
--

DROP TABLE IF EXISTS `habitacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habitacion` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `type` varchar(100) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `available` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `features` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habitacion`
--

LOCK TABLES `habitacion` WRITE;
/*!40000 ALTER TABLE `habitacion` DISABLE KEYS */;
INSERT INTO `habitacion` VALUES (1,'Estándar','/src/img/estandar.webp',10,'Habitación cómoda y funcional con todas las comodidades básicas','Cama individual, Baño privado, WiFi gratis, TV cable, Precio 100 Dolares'),(2,'Individual','/src/img/individual.webp',0,'Espacio personal diseñado para tu comodidad y privacidad','Cama queen, Escritorio, Mini bar, Aire acondicionado, Precio 120 Dolares'),(3,'Matrimonial','/src/img/matrimonial.webp',10,'Habitación romántica perfecta para parejas con cama king size','Cama king, Jacuzzi, Balcón privado, Desayuno incluido, Precio 150 Dolares'),(4,'Suite','/src/img/suite.webp',8,'Experiencia de lujo con espacios amplios y servicios premium','Sala de estar, Vista al mar, Servicio 24h, Amenities premium, Precio 250 Dolares');
/*!40000 ALTER TABLE `habitacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habitacion_numero`
--

DROP TABLE IF EXISTS `habitacion_numero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habitacion_numero` (
  `idNumero` int(11) NOT NULL AUTO_INCREMENT,
  `numeroHabitacion` varchar(10) NOT NULL,
  `idHabitacion` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`idNumero`),
  KEY `idHabitacion` (`idHabitacion`),
  CONSTRAINT `habitacion_numero_ibfk_1` FOREIGN KEY (`idHabitacion`) REFERENCES `habitacion` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habitacion_numero`
--

LOCK TABLES `habitacion_numero` WRITE;
/*!40000 ALTER TABLE `habitacion_numero` DISABLE KEYS */;
INSERT INTO `habitacion_numero` VALUES (1,'101',1),(2,'102',1),(3,'103',1),(4,'104',1),(5,'105',1),(6,'106',1),(7,'107',1),(8,'108',1),(9,'109',1),(10,'110',1),(11,'201',2),(12,'202',2),(13,'203',2),(14,'204',2),(15,'205',2),(16,'206',2),(17,'207',2),(18,'208',2),(19,'209',2),(20,'210',2),(21,'301',3),(22,'302',3),(23,'303',3),(24,'304',3),(25,'305',3),(26,'306',3),(27,'307',3),(28,'308',3),(29,'309',3),(30,'310',3),(31,'401',4),(32,'402',4),(33,'403',4),(34,'404',4),(35,'405',4),(36,'406',4),(37,'407',4),(38,'408',4),(39,'409',4),(40,'410',4);
/*!40000 ALTER TABLE `habitacion_numero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `IDUsuario` smallint(6) DEFAULT NULL,
  `IDHabitacion` int(11) DEFAULT NULL,
  `fechaPedido` date NOT NULL,
  `estado` enum('pendiente','en preparación','en camino','entregado','cancelado') DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fkHabitacion_idx` (`IDHabitacion`),
  KEY `fk_IdUsuario` (`IDUsuario`),
  CONSTRAINT `fkHabitacion` FOREIGN KEY (`IDHabitacion`) REFERENCES `habitacion_numero` (`idNumero`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_IdUsuario` FOREIGN KEY (`IDUsuario`) REFERENCES `usuario` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
INSERT INTO `pedido` VALUES (1,6,11,'2025-10-20','cancelado'),(2,6,11,'2025-10-20','entregado'),(3,6,11,'2025-10-20','pendiente'),(4,10,12,'2025-10-20','pendiente');
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservas`
--

DROP TABLE IF EXISTS `reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservas` (
  `IDReserva` int(11) NOT NULL AUTO_INCREMENT,
  `fechaIngreso` date NOT NULL,
  `fechaEgreso` date NOT NULL,
  `estado` enum('activo','cancelado','finalizado','pendiente','autorizado') NOT NULL DEFAULT 'activo',
  `precio` int(11) NOT NULL,
  `IDHabitacion` int(11) NOT NULL,
  `IDUsuario` smallint(10) NOT NULL,
  PRIMARY KEY (`IDReserva`),
  KEY `FK_usuarios_idx` (`IDUsuario`),
  KEY `FK_habitacion_idx` (`IDHabitacion`),
  CONSTRAINT `FK_habitacion` FOREIGN KEY (`IDHabitacion`) REFERENCES `habitacion_numero` (`idNumero`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_usuarios` FOREIGN KEY (`IDUsuario`) REFERENCES `usuario` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
INSERT INTO `reservas` VALUES (36,'2025-10-20','2025-10-23','cancelado',120,11,6),(37,'2025-10-11','2025-10-16','finalizado',120,11,6),(38,'2025-10-20','2025-10-22','finalizado',120,12,10),(39,'2025-10-19','2025-10-23','activo',120,11,6),(40,'2025-10-20','2025-10-24','activo',120,12,10);
/*!40000 ALTER TABLE `reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `ID` smallint(6) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correoElectronico` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fechaCreacion` date DEFAULT NULL,
  `rol` enum('admin','usuario') NOT NULL DEFAULT 'usuario' COMMENT 'l ENUM(''admin'', ''usuario'', ''invitado'') NOT NULL DEFAULT ''usuario''',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `correroElectronico` (`correoElectronico`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Federico','federico77@gmail.com','$2b$12$dvqaJyO1m8RhoFO98BYdsepmgalhoq9Cs6DR..Lj9Pd4u0pcYJZ/q',NULL,'2025-08-13','usuario'),(2,'johndoe123','johndoe@example.com','$2b$12$niLmstYKtrQrB0v6eM2jtOSAVuLZJrwkr6V.pQbvigDYGMQeI6bMm',NULL,'2025-08-14','usuario'),(3,'juanperez','juan@example.com','$2b$12$T6XU9dsvybSgIlLfffQsW.cK/UujSYyw72QPFpQ0OxUfGBGy44bcS',NULL,'2025-09-28','usuario'),(4,'Federico Del Valle','agustindelvallr@gmail.com','$2b$12$80z1YDeRA3hcOcbjVmxTPOqPYGVENZZjrH4C52HCrDtHsO8Uq64oW',NULL,'2025-10-02','usuario'),(5,'Federico Del Valle','fededelvalle@gmail.com','$2b$12$8.hk0efiF7/568AAGg75a.ZZWItwnf/8Fm9cHlqWVMaX9hRDYd02e',NULL,'2025-10-09','admin'),(6,'August ','august@gmail.com','$2b$12$qQcvBiRkAUzyIlYYDbaBSe7tC3ypdwnIi6VBRhopNx4JtpjeQS8Ai',NULL,'2025-10-10','usuario'),(7,'Patricio Carvallo','patricio@gmail.com','$2b$12$dQrgvNb1uORfog1YaukIZeq3hBF9e3675iM9zW9sw2WkuuB2bG9ie',NULL,'2025-10-15','usuario'),(8,'Pedro Sanchez','Pedro@gmail.com','$2b$12$F7Ywps.WtRp5MxFqRdmDY.Hwp.aYivYGvjKj660n3nF/cIB0m/sAe',NULL,'2025-10-16','usuario'),(9,'UsuarioAdmin','admin@gmail.com','$2b$12$LGYODI0bHCMNesq8AYgYv.EqQAyaC/7Z/cBGDRxbHwo5MRs6oc2uC',NULL,'2025-10-16','admin'),(10,'Lucas Gabriel Del Valle','Lukas@gmail.com','$2b$12$8HsuIp2PTHMeWRUPOu4VZupFy5U7FcaOtyjIlRTv79fUuS2jAeEiC',NULL,'2025-10-17','usuario'),(11,'Nicolas Maquiavelo','NicolasMaq@gmail.com','$2b$12$GSpYemSjNvaexHwaolTHLej0KV11iWTk5nqSdw93XHp1yexv5fcYe',NULL,'2025-10-17','usuario');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-20 14:13:48
