-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: unidesk
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `exam_schedules`
--

DROP TABLE IF EXISTS `exam_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `year` varchar(20) DEFAULT NULL,
  `batch` varchar(50) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `sub_department` varchar(100) DEFAULT NULL,
  `section` varchar(20) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `subject_code` varchar(50) DEFAULT NULL,
  `exam_date` date DEFAULT NULL,
  `day` varchar(20) DEFAULT NULL,
  `time_window` varchar(50) DEFAULT NULL,
  `assigned_hall` varchar(100) DEFAULT NULL,
  `target_cohort` varchar(255) DEFAULT NULL,
  `invigilator` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_schedules`
--

LOCK TABLES `exam_schedules` WRITE;
/*!40000 ALTER TABLE `exam_schedules` DISABLE KEYS */;
INSERT INTO `exam_schedules` VALUES (1,'3','2025-2029','cse','computer science','A','Data Structures','CSE301','2026-10-15','Thursday','10:00-12:00','Exam Hall 1','s25cseu0655, s25cseu0647, s25cseu0658','Dr. Sharma'),(2,'3','2025-2029','cse','computer science','A','Database Management','CSE302','2026-10-17','Saturday','10:00-12:00','Exam Hall 2','s25cseu0655, s25cseu0647, s25cseu0658','Dr. Gupta'),(3,'3','2025-2029','cse','computer science','A','Operating Systems','CSE303','2026-10-20','Tuesday','10:00-12:00','Exam Hall 1','s25cseu0655, s25cseu0647, s25cseu0658','Dr. Verma'),(4,'3','2025-2029','cse','computer science','A','Computer Networks','CSE304','2026-10-22','Thursday','10:00-12:00','Exam Hall 2','s25cseu0655, s25cseu0647, s25cseu0658','Dr. Singh');
/*!40000 ALTER TABLE `exam_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fees`
--

DROP TABLE IF EXISTS `fees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enrollment_number` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `year_sem` varchar(50) DEFAULT NULL,
  `batch` varchar(50) DEFAULT NULL,
  `accommodation` varchar(100) DEFAULT NULL,
  `total_fee` decimal(10,2) NOT NULL,
  `paid_amount` decimal(10,2) DEFAULT '0.00',
  `pending_dues` decimal(10,2) DEFAULT '0.00',
  `payment_status` enum('pending','partial','paid') DEFAULT 'pending',
  `due_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fees`
--

LOCK TABLES `fees` WRITE;
/*!40000 ALTER TABLE `fees` DISABLE KEYS */;
INSERT INTO `fees` VALUES (1,'s25cseu0655','Vibhuti Narang','vibhuti@unidesk.com','9876543210','cse','3','2025-2029','hostel',150000.00,100000.00,50000.00,'partial','2026-10-25'),(2,'s25cseu0647','Mahi','mahi@unidesk.com','9876543211','cse','3','2025-2029','hostel',150000.00,150000.00,0.00,'paid','2026-10-25'),(3,'s25cseu0658','Apurva','apurva@unidesk.com','9876543212','cse','3','2025-2029','day scholar',120000.00,60000.00,60000.00,'partial','2026-10-25');
/*!40000 ALTER TABLE `fees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(100) DEFAULT NULL,
  `audience` enum('all','students','faculty','staff') DEFAULT 'all',
  `published_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `status` enum('active','expired','draft') DEFAULT 'active',
  `department` enum('it','finance','academic','general') DEFAULT 'general',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
INSERT INTO `notices` VALUES (1,'Mid Semester Examination','Mid semester examinations will begin from 15 October 2026.','exam_datesheet','students','2026-10-07','2026-10-20','active','academic'),(2,'Fee Payment Deadline','Students are requested to clear their pending fees before the due date.','fee_payment','students','2026-10-07','2026-10-25','active','finance'),(4,'Network Maintenance','Campus network services may be unavailable during scheduled maintenance.','network_maintenance','all','2026-10-07','2026-10-08','active','it');
/*!40000 ALTER TABLE `notices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routing`
--

DROP TABLE IF EXISTS `routing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routing` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_request` text NOT NULL,
  `detected_intent` varchar(255) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `routing_decision` varchar(255) DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routing`
--

LOCK TABLES `routing` WRITE;
/*!40000 ALTER TABLE `routing` DISABLE KEYS */;
INSERT INTO `routing` VALUES (1,'wifi is not working in my hostel','network_issue','it','routed to IT Infrastructure - Vibhuti Narang - s25cseu0655','2026-10-07 00:59:44'),(2,'i cannot login to the student portal','authentication_issue','it','routed to IT Support - Mahi - s25cseu0647','2026-10-07 00:59:44'),(3,'i need clarification about my exam timetable','exam_schedule','academic','routed to Academic Office - Apurva - s25cseu0658','2026-10-07 00:59:44'),(4,'my fee payment is not showing','fee_payment','finance','routed to Finance Office - Vibhuti Narang - s25cseu0655','2026-10-07 00:59:44');
/*!40000 ALTER TABLE `routing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enrollment_number` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `year_sem` varchar(50) DEFAULT NULL,
  `batch` varchar(50) DEFAULT NULL,
  `accommodation` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `enrollment_number` (`enrollment_number`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'s25cseu0655','Vibhuti Narang','vibhuti@unidesk.com','9876543210','B. Tech','3','2025-2029','hostel'),(2,'s25cseu0647','Mahi','mahi@unidesk.com','9876543211','cse','3','2025-2029','hostel'),(3,'s25cseu0658','Apurva','apurva@unidesk.com','9876543212','cse','3','2025-2029','day scholar');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticket_no` varchar(50) NOT NULL,
  `raised_by` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `assigned_to` varchar(255) DEFAULT NULL,
  `status` enum('open','in_progress','resolved','closed') DEFAULT 'open',
  `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `note` text,
  `department` enum('it','finance','academic','general') DEFAULT 'general',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_no` (`ticket_no`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,'IT001','vibhuti@unidesk.com','wifi not working','network','IT Support','open','2026-10-07 01:46:02','internet is not working in hostel','it'),(9,'IT004','mahi@unidesk.com','unable to login','authentication','IT Support','in_progress','2026-10-07 00:54:51','unable to access student portal','it'),(10,'AC002','apurva@unidesk.com','exam timetable issue','exam','Academic Office','resolved','2026-10-07 00:54:51','exam date needs clarification','academic'),(11,'FN002','vibhuti@unidesk.com','fee payment issue','fee','Finance Office','open','2026-10-07 00:54:51','payment is not reflecting','finance');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timetables`
--

DROP TABLE IF EXISTS `timetables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timetables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `year` varchar(20) DEFAULT NULL,
  `batch` varchar(50) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `sub_department` varchar(100) DEFAULT NULL,
  `section` varchar(20) DEFAULT NULL,
  `day` varchar(20) DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `faculty` varchar(255) DEFAULT NULL,
  `room` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=165 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timetables`
--

LOCK TABLES `timetables` WRITE;
/*!40000 ALTER TABLE `timetables` DISABLE KEYS */;
INSERT INTO `timetables` VALUES (5,'1','2025-2029','btech','computer science','A','Monday','09:00-10:00','Programming Fundamentals','Dr. Sharma','B101'),(6,'1','2025-2029','btech','computer science','A','Monday','10:00-11:00','Mathematics I','Dr. Gupta','B102'),(7,'1','2025-2029','btech','computer science','A','Monday','11:00-12:00','Digital Logic','Dr. Verma','B103'),(8,'1','2025-2029','btech','computer science','A','Monday','12:00-13:00','Engineering Physics','Dr. Singh','B104'),(9,'1','2025-2029','btech','computer science','A','Tuesday','09:00-10:00','Mathematics I','Dr. Gupta','B102'),(10,'1','2025-2029','btech','computer science','A','Tuesday','10:00-11:00','Programming Fundamentals','Dr. Sharma','B101'),(11,'1','2025-2029','btech','computer science','A','Tuesday','11:00-12:00','Engineering Physics','Dr. Singh','B104'),(12,'1','2025-2029','btech','computer science','A','Tuesday','12:00-13:00','Digital Logic','Dr. Verma','B103'),(13,'1','2025-2029','btech','computer science','A','Wednesday','09:00-10:00','Digital Logic','Dr. Verma','B103'),(14,'1','2025-2029','btech','computer science','A','Wednesday','10:00-11:00','Engineering Physics','Dr. Singh','B104'),(15,'1','2025-2029','btech','computer science','A','Wednesday','11:00-12:00','Mathematics I','Dr. Gupta','B102'),(16,'1','2025-2029','btech','computer science','A','Wednesday','12:00-13:00','Programming Fundamentals','Dr. Sharma','B101'),(17,'1','2025-2029','btech','computer science','A','Thursday','09:00-10:00','Engineering Physics','Dr. Singh','B104'),(18,'1','2025-2029','btech','computer science','A','Thursday','10:00-11:00','Digital Logic','Dr. Verma','B103'),(19,'1','2025-2029','btech','computer science','A','Thursday','11:00-12:00','Programming Fundamentals','Dr. Sharma','B101'),(20,'1','2025-2029','btech','computer science','A','Thursday','12:00-13:00','Mathematics I','Dr. Gupta','B102'),(21,'1','2025-2029','btech','computer science','A','Friday','09:00-10:00','Programming Fundamentals','Dr. Sharma','B101'),(22,'1','2025-2029','btech','computer science','A','Friday','10:00-11:00','Digital Logic','Dr. Verma','B103'),(23,'1','2025-2029','btech','computer science','A','Friday','11:00-12:00','Mathematics I','Dr. Gupta','B102'),(24,'1','2025-2029','btech','computer science','A','Friday','12:00-13:00','Engineering Physics','Dr. Singh','B104'),(25,'2','2024-2028','btech','computer science','A','Monday','09:00-10:00','Data Structures','Dr. Sharma','B201'),(26,'2','2024-2028','btech','computer science','A','Monday','10:00-11:00','Database Management','Dr. Gupta','B202'),(27,'2','2024-2028','btech','computer science','A','Monday','11:00-12:00','Computer Organization','Dr. Verma','B203'),(28,'2','2024-2028','btech','computer science','A','Monday','12:00-13:00','Discrete Mathematics','Dr. Singh','B204'),(29,'2','2024-2028','btech','computer science','A','Tuesday','09:00-10:00','Database Management','Dr. Gupta','B202'),(30,'2','2024-2028','btech','computer science','A','Tuesday','10:00-11:00','Data Structures','Dr. Sharma','B201'),(31,'2','2024-2028','btech','computer science','A','Tuesday','11:00-12:00','Discrete Mathematics','Dr. Singh','B204'),(32,'2','2024-2028','btech','computer science','A','Tuesday','12:00-13:00','Computer Organization','Dr. Verma','B203'),(33,'2','2024-2028','btech','computer science','A','Wednesday','09:00-10:00','Computer Organization','Dr. Verma','B203'),(34,'2','2024-2028','btech','computer science','A','Wednesday','10:00-11:00','Discrete Mathematics','Dr. Singh','B204'),(35,'2','2024-2028','btech','computer science','A','Wednesday','11:00-12:00','Database Management','Dr. Gupta','B202'),(36,'2','2024-2028','btech','computer science','A','Wednesday','12:00-13:00','Data Structures','Dr. Sharma','B201'),(37,'2','2024-2028','btech','computer science','A','Thursday','09:00-10:00','Discrete Mathematics','Dr. Singh','B204'),(38,'2','2024-2028','btech','computer science','A','Thursday','10:00-11:00','Computer Organization','Dr. Verma','B203'),(39,'2','2024-2028','btech','computer science','A','Thursday','11:00-12:00','Data Structures','Dr. Sharma','B201'),(40,'2','2024-2028','btech','computer science','A','Thursday','12:00-13:00','Database Management','Dr. Gupta','B202'),(41,'2','2024-2028','btech','computer science','A','Friday','09:00-10:00','Data Structures','Dr. Sharma','B201'),(42,'2','2024-2028','btech','computer science','A','Friday','10:00-11:00','Computer Organization','Dr. Verma','B203'),(43,'2','2024-2028','btech','computer science','A','Friday','11:00-12:00','Database Management','Dr. Gupta','B202'),(44,'2','2024-2028','btech','computer science','A','Friday','12:00-13:00','Discrete Mathematics','Dr. Singh','B204'),(45,'3','2023-2027','btech','computer science','A','Monday','09:00-10:00','Data Structures','Dr. Sharma','B301'),(46,'3','2023-2027','btech','computer science','A','Monday','10:00-11:00','Database Management','Dr. Gupta','B302'),(47,'3','2023-2027','btech','computer science','A','Monday','11:00-12:00','Operating Systems','Dr. Verma','B303'),(48,'3','2023-2027','btech','computer science','A','Monday','12:00-13:00','Computer Networks','Dr. Singh','B304'),(49,'3','2023-2027','btech','computer science','A','Tuesday','09:00-10:00','Database Management','Dr. Gupta','B302'),(50,'3','2023-2027','btech','computer science','A','Tuesday','10:00-11:00','Operating Systems','Dr. Verma','B303'),(51,'3','2023-2027','btech','computer science','A','Tuesday','11:00-12:00','Computer Networks','Dr. Singh','B304'),(52,'3','2023-2027','btech','computer science','A','Tuesday','12:00-13:00','Data Structures','Dr. Sharma','B301'),(53,'3','2023-2027','btech','computer science','A','Wednesday','09:00-10:00','Operating Systems','Dr. Verma','B303'),(54,'3','2023-2027','btech','computer science','A','Wednesday','10:00-11:00','Computer Networks','Dr. Singh','B304'),(55,'3','2023-2027','btech','computer science','A','Wednesday','11:00-12:00','Data Structures','Dr. Sharma','B301'),(56,'3','2023-2027','btech','computer science','A','Wednesday','12:00-13:00','Database Management','Dr. Gupta','B302'),(57,'3','2023-2027','btech','computer science','A','Thursday','09:00-10:00','Computer Networks','Dr. Singh','B304'),(58,'3','2023-2027','btech','computer science','A','Thursday','10:00-11:00','Data Structures','Dr. Sharma','B301'),(59,'3','2023-2027','btech','computer science','A','Thursday','11:00-12:00','Database Management','Dr. Gupta','B302'),(60,'3','2023-2027','btech','computer science','A','Thursday','12:00-13:00','Operating Systems','Dr. Verma','B303'),(61,'3','2023-2027','btech','computer science','A','Friday','09:00-10:00','Data Structures','Dr. Sharma','B301'),(62,'3','2023-2027','btech','computer science','A','Friday','10:00-11:00','Database Management','Dr. Gupta','B302'),(63,'3','2023-2027','btech','computer science','A','Friday','11:00-12:00','Computer Networks','Dr. Singh','B304'),(64,'3','2023-2027','btech','computer science','A','Friday','12:00-13:00','Operating Systems','Dr. Verma','B303'),(65,'4','2022-2026','btech','computer science','A','Monday','09:00-10:00','Machine Learning','Dr. Sharma','B401'),(66,'4','2022-2026','btech','computer science','A','Monday','10:00-11:00','Cloud Computing','Dr. Gupta','B402'),(67,'4','2022-2026','btech','computer science','A','Monday','11:00-12:00','Cyber Security','Dr. Verma','B403'),(68,'4','2022-2026','btech','computer science','A','Monday','12:00-13:00','Software Engineering','Dr. Singh','B404'),(69,'4','2022-2026','btech','computer science','A','Tuesday','09:00-10:00','Cloud Computing','Dr. Gupta','B402'),(70,'4','2022-2026','btech','computer science','A','Tuesday','10:00-11:00','Cyber Security','Dr. Verma','B403'),(71,'4','2022-2026','btech','computer science','A','Tuesday','11:00-12:00','Software Engineering','Dr. Singh','B404'),(72,'4','2022-2026','btech','computer science','A','Tuesday','12:00-13:00','Machine Learning','Dr. Sharma','B401'),(73,'4','2022-2026','btech','computer science','A','Wednesday','09:00-10:00','Cyber Security','Dr. Verma','B403'),(74,'4','2022-2026','btech','computer science','A','Wednesday','10:00-11:00','Software Engineering','Dr. Singh','B404'),(75,'4','2022-2026','btech','computer science','A','Wednesday','11:00-12:00','Machine Learning','Dr. Sharma','B401'),(76,'4','2022-2026','btech','computer science','A','Wednesday','12:00-13:00','Cloud Computing','Dr. Gupta','B402'),(77,'4','2022-2026','btech','computer science','A','Thursday','09:00-10:00','Software Engineering','Dr. Singh','B404'),(78,'4','2022-2026','btech','computer science','A','Thursday','10:00-11:00','Machine Learning','Dr. Sharma','B401'),(79,'4','2022-2026','btech','computer science','A','Thursday','11:00-12:00','Cloud Computing','Dr. Gupta','B402'),(80,'4','2022-2026','btech','computer science','A','Thursday','12:00-13:00','Cyber Security','Dr. Verma','B403'),(81,'4','2022-2026','btech','computer science','A','Friday','09:00-10:00','Machine Learning','Dr. Sharma','B401'),(82,'4','2022-2026','btech','computer science','A','Friday','10:00-11:00','Cloud Computing','Dr. Gupta','B402'),(83,'4','2022-2026','btech','computer science','A','Friday','11:00-12:00','Cyber Security','Dr. Verma','B403'),(84,'4','2022-2026','btech','computer science','A','Friday','12:00-13:00','Software Engineering','Dr. Singh','B404'),(85,'1','2025-2029','design','design','A','Monday','09:00-10:00','Design Fundamentals','Prof. Mehta','D101'),(86,'1','2025-2029','design','design','A','Monday','10:00-11:00','Drawing and Sketching','Prof. Kapoor','D102'),(87,'1','2025-2029','design','design','A','Monday','11:00-12:00','Design History','Prof. Rao','D103'),(88,'1','2025-2029','design','design','A','Monday','12:00-13:00','Visual Communication','Prof. Shah','D104'),(89,'1','2025-2029','design','design','A','Tuesday','09:00-10:00','Drawing and Sketching','Prof. Kapoor','D102'),(90,'1','2025-2029','design','design','A','Tuesday','10:00-11:00','Design History','Prof. Rao','D103'),(91,'1','2025-2029','design','design','A','Tuesday','11:00-12:00','Visual Communication','Prof. Shah','D104'),(92,'1','2025-2029','design','design','A','Tuesday','12:00-13:00','Design Fundamentals','Prof. Mehta','D101'),(93,'1','2025-2029','design','design','A','Wednesday','09:00-10:00','Design History','Prof. Rao','D103'),(94,'1','2025-2029','design','design','A','Wednesday','10:00-11:00','Visual Communication','Prof. Shah','D104'),(95,'1','2025-2029','design','design','A','Wednesday','11:00-12:00','Design Fundamentals','Prof. Mehta','D101'),(96,'1','2025-2029','design','design','A','Wednesday','12:00-13:00','Drawing and Sketching','Prof. Kapoor','D102'),(97,'1','2025-2029','design','design','A','Thursday','09:00-10:00','Visual Communication','Prof. Shah','D104'),(98,'1','2025-2029','design','design','A','Thursday','10:00-11:00','Design Fundamentals','Prof. Mehta','D101'),(99,'1','2025-2029','design','design','A','Thursday','11:00-12:00','Drawing and Sketching','Prof. Kapoor','D102'),(100,'1','2025-2029','design','design','A','Thursday','12:00-13:00','Design History','Prof. Rao','D103'),(101,'1','2025-2029','design','design','A','Friday','09:00-10:00','Design Fundamentals','Prof. Mehta','D101'),(102,'1','2025-2029','design','design','A','Friday','10:00-11:00','Design History','Prof. Rao','D103'),(103,'1','2025-2029','design','design','A','Friday','11:00-12:00','Drawing and Sketching','Prof. Kapoor','D102'),(104,'1','2025-2029','design','design','A','Friday','12:00-13:00','Visual Communication','Prof. Shah','D104'),(105,'2','2024-2028','design','design','A','Monday','09:00-10:00','Typography','Prof. Mehta','D201'),(106,'2','2024-2028','design','design','A','Monday','10:00-11:00','Graphic Design','Prof. Kapoor','D202'),(107,'2','2024-2028','design','design','A','Monday','11:00-12:00','Photography','Prof. Rao','D203'),(108,'2','2024-2028','design','design','A','Monday','12:00-13:00','Design Research','Prof. Shah','D204'),(109,'2','2024-2028','design','design','A','Tuesday','09:00-10:00','Graphic Design','Prof. Kapoor','D202'),(110,'2','2024-2028','design','design','A','Tuesday','10:00-11:00','Photography','Prof. Rao','D203'),(111,'2','2024-2028','design','design','A','Tuesday','11:00-12:00','Design Research','Prof. Shah','D204'),(112,'2','2024-2028','design','design','A','Tuesday','12:00-13:00','Typography','Prof. Mehta','D201'),(113,'2','2024-2028','design','design','A','Wednesday','09:00-10:00','Photography','Prof. Rao','D203'),(114,'2','2024-2028','design','design','A','Wednesday','10:00-11:00','Design Research','Prof. Shah','D204'),(115,'2','2024-2028','design','design','A','Wednesday','11:00-12:00','Typography','Prof. Mehta','D201'),(116,'2','2024-2028','design','design','A','Wednesday','12:00-13:00','Graphic Design','Prof. Kapoor','D202'),(117,'2','2024-2028','design','design','A','Thursday','09:00-10:00','Design Research','Prof. Shah','D204'),(118,'2','2024-2028','design','design','A','Thursday','10:00-11:00','Typography','Prof. Mehta','D201'),(119,'2','2024-2028','design','design','A','Thursday','11:00-12:00','Graphic Design','Prof. Kapoor','D202'),(120,'2','2024-2028','design','design','A','Thursday','12:00-13:00','Photography','Prof. Rao','D203'),(121,'2','2024-2028','design','design','A','Friday','09:00-10:00','Typography','Prof. Mehta','D201'),(122,'2','2024-2028','design','design','A','Friday','10:00-11:00','Graphic Design','Prof. Kapoor','D202'),(123,'2','2024-2028','design','design','A','Friday','11:00-12:00','Photography','Prof. Rao','D203'),(124,'2','2024-2028','design','design','A','Friday','12:00-13:00','Design Research','Prof. Shah','D204'),(125,'3','2023-2027','design','design','A','Monday','09:00-10:00','UI UX Design','Prof. Mehta','D301'),(126,'3','2023-2027','design','design','A','Monday','10:00-11:00','Interaction Design','Prof. Kapoor','D302'),(127,'3','2023-2027','design','design','A','Monday','11:00-12:00','Brand Design','Prof. Rao','D303'),(128,'3','2023-2027','design','design','A','Monday','12:00-13:00','Design Systems','Prof. Shah','D304'),(129,'3','2023-2027','design','design','A','Tuesday','09:00-10:00','Interaction Design','Prof. Kapoor','D302'),(130,'3','2023-2027','design','design','A','Tuesday','10:00-11:00','Brand Design','Prof. Rao','D303'),(131,'3','2023-2027','design','design','A','Tuesday','11:00-12:00','Design Systems','Prof. Shah','D304'),(132,'3','2023-2027','design','design','A','Tuesday','12:00-13:00','UI UX Design','Prof. Mehta','D301'),(133,'3','2023-2027','design','design','A','Wednesday','09:00-10:00','Brand Design','Prof. Rao','D303'),(134,'3','2023-2027','design','design','A','Wednesday','10:00-11:00','Design Systems','Prof. Shah','D304'),(135,'3','2023-2027','design','design','A','Wednesday','11:00-12:00','UI UX Design','Prof. Mehta','D301'),(136,'3','2023-2027','design','design','A','Wednesday','12:00-13:00','Interaction Design','Prof. Kapoor','D302'),(137,'3','2023-2027','design','design','A','Thursday','09:00-10:00','Design Systems','Prof. Shah','D304'),(138,'3','2023-2027','design','design','A','Thursday','10:00-11:00','UI UX Design','Prof. Mehta','D301'),(139,'3','2023-2027','design','design','A','Thursday','11:00-12:00','Interaction Design','Prof. Kapoor','D302'),(140,'3','2023-2027','design','design','A','Thursday','12:00-13:00','Brand Design','Prof. Rao','D303'),(141,'3','2023-2027','design','design','A','Friday','09:00-10:00','UI UX Design','Prof. Mehta','D301'),(142,'3','2023-2027','design','design','A','Friday','10:00-11:00','Interaction Design','Prof. Kapoor','D302'),(143,'3','2023-2027','design','design','A','Friday','11:00-12:00','Brand Design','Prof. Rao','D303'),(144,'3','2023-2027','design','design','A','Friday','12:00-13:00','Design Systems','Prof. Shah','D304'),(145,'4','2022-2026','design','design','A','Monday','09:00-10:00','Advanced UX Design','Prof. Mehta','D401'),(146,'4','2022-2026','design','design','A','Monday','10:00-11:00','Design Management','Prof. Kapoor','D402'),(147,'4','2022-2026','design','design','A','Monday','11:00-12:00','Portfolio Design','Prof. Rao','D403'),(148,'4','2022-2026','design','design','A','Monday','12:00-13:00','Design Project','Prof. Shah','D404'),(149,'4','2022-2026','design','design','A','Tuesday','09:00-10:00','Design Management','Prof. Kapoor','D402'),(150,'4','2022-2026','design','design','A','Tuesday','10:00-11:00','Portfolio Design','Prof. Rao','D403'),(151,'4','2022-2026','design','design','A','Tuesday','11:00-12:00','Design Project','Prof. Shah','D404'),(152,'4','2022-2026','design','design','A','Tuesday','12:00-13:00','Advanced UX Design','Prof. Mehta','D401'),(153,'4','2022-2026','design','design','A','Wednesday','09:00-10:00','Portfolio Design','Prof. Rao','D403'),(154,'4','2022-2026','design','design','A','Wednesday','10:00-11:00','Design Project','Prof. Shah','D404'),(155,'4','2022-2026','design','design','A','Wednesday','11:00-12:00','Advanced UX Design','Prof. Mehta','D401'),(156,'4','2022-2026','design','design','A','Wednesday','12:00-13:00','Design Management','Prof. Kapoor','D402'),(157,'4','2022-2026','design','design','A','Thursday','09:00-10:00','Design Project','Prof. Shah','D404'),(158,'4','2022-2026','design','design','A','Thursday','10:00-11:00','Advanced UX Design','Prof. Mehta','D401'),(159,'4','2022-2026','design','design','A','Thursday','11:00-12:00','Design Management','Prof. Kapoor','D402'),(160,'4','2022-2026','design','design','A','Thursday','12:00-13:00','Portfolio Design','Prof. Rao','D403'),(161,'4','2022-2026','design','design','A','Friday','09:00-10:00','Advanced UX Design','Prof. Mehta','D401'),(162,'4','2022-2026','design','design','A','Friday','10:00-11:00','Design Management','Prof. Kapoor','D402'),(163,'4','2022-2026','design','design','A','Friday','11:00-12:00','Portfolio Design','Prof. Rao','D403'),(164,'4','2022-2026','design','design','A','Friday','12:00-13:00','Design Project','Prof. Shah','D404');
/*!40000 ALTER TABLE `timetables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `department` enum('it','finance','academic','general') DEFAULT 'general',
  `role` enum('admin','student','faculty','staff') DEFAULT 'student',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email` (`user_email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'IT@unidesk.com','it123','it','admin'),(2,'vibhuti@unidesk.com','vibhuti123','general','student'),(3,'mahi@unidesk.com','mahi123','general','student'),(4,'apurva@unidesk.com','apurva123','general','student'),(5,'academic@unidesk.com','academic123','academic','admin'),(6,'finance@unidesk.com','finance123','finance','admin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-08  2:35:38
