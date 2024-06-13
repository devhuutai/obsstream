-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: obstreamnoah
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `noah_auth`
--

DROP TABLE IF EXISTS `noah_auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `noah_auth` (
  `id` int NOT NULL,
  `name` longtext,
  `password` longtext,
  `uuid` longtext,
  `role` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noah_auth`
--

LOCK TABLES `noah_auth` WRITE;
/*!40000 ALTER TABLE `noah_auth` DISABLE KEYS */;
INSERT INTO `noah_auth` VALUES (1,'admin','$2b$10$Wod8NQLBYDHZu03bCDHR.emJ3QAJPq3QY9AD7jH292Qq2kO9nDSlW','123123','admin');
/*!40000 ALTER TABLE `noah_auth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noah_streamkey`
--

DROP TABLE IF EXISTS `noah_streamkey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `noah_streamkey` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` longtext,
  `token` longtext,
  `streamKey` longtext,
  `createdAT` json DEFAULT NULL,
  `isDeleted` json DEFAULT NULL,
  `status` int DEFAULT NULL,
  `title` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noah_streamkey`
--

LOCK TABLES `noah_streamkey` WRITE;
/*!40000 ALTER TABLE `noah_streamkey` DISABLE KEYS */;
INSERT INTO `noah_streamkey` VALUES (4,'bc9405ba-f8df-46fc-9316-6ccb86eff87c','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHJlYW1LZXkiOiJzdHJlYW0tM21yN2RqOGwiLCJpYXQiOjE2ODc4NzM0MjV9.DCGD7hqVqd_T3DR15qZouNclIeFO_XsesVcwQeK_Ixc','stream-3mr7dj8l','{\"id\": 1, \"time\": 1687873419627}',NULL,1,'asdasdasd'),(5,'bf9ec839-0d9e-41a7-a559-ea14a744e226','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHJlYW1LZXkiOiJzdHJlYW0tajZtcjgzaHgiLCJpYXQiOjE2ODc4ODA5ODF9.IKzyQOrNq0XN_luKyRuTAf7b8sDUMje9YVRkpdHYiLM','stream-j6mr83hx','{\"id\": 1, \"time\": 1687880930724}',NULL,1,'test'),(6,'0899eec6-c258-4325-bf32-e420dde0efe5','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHJlYW1LZXkiOiJzdHJlYW0tZG5zaW8wbmQiLCJpYXQiOjE2ODc4ODE1Mjd9.NLA_ZmN4m9zDz0ry3s1jbJqgPeSij2dUd9S88umYSG0','stream-dnsio0nd','{\"id\": 1, \"time\": 1687881516420}',NULL,1,NULL);
/*!40000 ALTER TABLE `noah_streamkey` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noah_systeminfo`
--

DROP TABLE IF EXISTS `noah_systeminfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `noah_systeminfo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` int DEFAULT NULL,
  `port` float DEFAULT NULL,
  `network` float DEFAULT NULL,
  `cpu` float DEFAULT NULL,
  `ram` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noah_systeminfo`
--

LOCK TABLES `noah_systeminfo` WRITE;
/*!40000 ALTER TABLE `noah_systeminfo` DISABLE KEYS */;
INSERT INTO `noah_systeminfo` VALUES (1,123123,8000,222,26.238,8570.62);
/*!40000 ALTER TABLE `noah_systeminfo` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-13 13:38:16
