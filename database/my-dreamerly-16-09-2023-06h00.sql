-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: my_dreamerly
-- ------------------------------------------------------
-- Server version	5.7.43

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
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sender_id` bigint(20) NOT NULL,
  `receiver_id` bigint(20) NOT NULL,
  `message` text COLLATE utf8_unicode_ci,
  `seen` bit(1) DEFAULT b'0',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` VALUES (1,16,23,'Học ơi',_binary '\0','2023-09-16 05:20:04'),(2,23,16,'Gì vậy Sương',_binary '\0','2023-09-16 05:20:13'),(3,16,23,'Cho mượn ít tiền được không',_binary '\0','2023-09-16 05:21:24'),(4,23,16,'Gì cơ',_binary '\0','2023-09-16 05:21:45'),(5,16,23,'cho tui mượn tiền',_binary '\0','2023-09-16 05:22:32'),(6,23,16,'gì vậy',_binary '\0','2023-09-16 05:23:30'),(7,16,23,'hổng hiểu à',_binary '\0','2023-09-16 05:24:38'),(8,23,16,'gì mượn tiền vậy chị hai',_binary '\0','2023-09-16 05:26:08'),(9,16,23,'thì mượn cái mai trả',_binary '\0','2023-09-16 05:27:20'),(10,23,16,'éo tin',_binary '\0','2023-09-16 05:27:23');
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `display_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lang` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `currency` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `remember_token` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'nguyenkimdien02@gmail.com','246357','Nguyễn Kim Điền','988162753','Iconarchive-Incognito-Animals-Rabbit-Avatar.512.png','vi','VND',NULL),(16,'tranthithusuong@dienkim.vn','246357','Trần Thị Thu Sương','912121212','Iconarchive-Incognito-Animals-Owl-Avatar.512.png','vi','VND','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsImlhdCI6MTY5NDc5NzcxOSwiZXhwIjoxNjk0ODMzNzE5fQ.bdJdANjr2r8YqbRB3qwvJYM89cYOadrKOxrxoFKiZgU'),(17,'nguyenthihuong@dienkim.vn','246357','Nguyễn Thị Hương','901234567','Iconarchive-Incognito-Animals-Mouse-Avatar.512.png','vi','VND',NULL),(18,'dothitrinh@dienkim.vn','246357','Đỗ Thị Trinh','956702341','Iconarchive-Incognito-Animals-Monkey-Avatar.512.png','vi','VND',NULL),(19,'tranthingocmai@dienkim.vn','246357','Trần Thị Ngọc Mai','967082341','Iconarchive-Incognito-Animals-Meerkat-Avatar.512.png','vi','VND',NULL),(20,'lythuongkiet123@dienkim.vn','246357','Lý Thường Kiệt','902345671','Iconarchive-Incognito-Animals-Mammoth-Avatar.512.png','vi','VND',NULL),(21,'lythaito@dienkim.vn','246357','Lý Thái Tổ','956702381','Iconarchive-Incognito-Animals-Lion-Avatar.512.png','vi','VND',NULL),(22,'dienbienphu@dienkim.vn','246357','Điện Biên Phủ','912356708','Iconarchive-Incognito-Animals-Leopard-Avatar.512.png','vi','VND',NULL),(23,'nguyenthaihoc@dienkim.vn','246357','Nguyễn Thái Học','905678231','Iconarchive-Incognito-Animals-Koala-Avatar.512.png','vi','VND','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTY5NDgwNjU0NywiZXhwIjoxNjk0ODQyNTQ3fQ.ZKD60cFX1H5zo-s1N9isxFmbC026Kz8xkRA4vXivOcA'),(24,'buidinhcuong@dienkim.vn','246357','Bùi Đình Cường','904567841','Iconarchive-Incognito-Animals-Lama-Avatar.512.png','vi','VND',NULL),(25,'buixuanthuan@dienkim.vn','246357','Bùi Xuân Thuận','924567081','Iconarchive-Incognito-Animals-Kangaroo-Avatar.512.png','vi','VND',NULL),(26,'phamhonganh@dienkim.vn','246357','Phạm Hồng Anh','945078231','Iconarchive-Incognito-Animals-Horse-Avatar.512.png','vi','VND',NULL),(27,'dangvanthanh@dienkim.vn','246357','Đặng Văn Thành','987023641','Iconarchive-Incognito-Animals-Hedgehog-Avatar.512.png','vi','VND',NULL),(28,'danghonganh@dienkim.vn','246357','Đặng Hồng Anh','923456789','Iconarchive-Incognito-Animals-Gorilla-Avatar.512.png','vi','VND',NULL),(29,'tranthixanh@dienkim.vn','246357','Trần Thị Xanh','914567023','Iconarchive-Incognito-Animals-Giraffe-Avatar.512.png','vi','VND',NULL),(30,'lethidua@dienkim.vn','246357','Lê Thị Dừa','914567045','Iconarchive-Incognito-Animals-Elephant-Avatar.512.png','vi','VND',NULL),(31,'vudinhthai@dienkim.vn','246357','Vũ Đình Thái','902345671','Iconarchive-Incognito-Animals-Dog-Avatar.512.png','vi','VND',NULL),(32,'levandai@dienkim.vn','246357','Lê Văn Đại','956027130','Iconarchive-Incognito-Animals-Dino-Avatar.512.png','vi','VND',NULL),(33,'phamdinhcuong@dienkim.vn','246357','Phạm Đình Cường','925670281','Iconarchive-Incognito-Animals-Crocodile-Avatar.512.png','vi','VND',NULL),(34,'vinhthienkim@dienkim.vn','246357','Vĩnh Thiên Kim','907234561','Iconarchive-Incognito-Animals-Cat-Avatar.512.png','vi','VND',NULL),(35,'dinhbolinh@dienkim.vn','246357','Đinh Bộ Lĩnh','902356781','Iconarchive-Incognito-Animals-Bison-Avatar.512.png','vi','VND',NULL),(36,'tranthichan@dienkim.vn','246357','Trần Thị Chân','914567802','Hopstarter-Halloween-Avatar-Devil.512.png','vi','VND',NULL),(37,'trieuthida@dienkim.vn','246357','Triệu Thị Đà','902367891','Iconarchive-Incognito-Animals-Bear-Avatar.512.png','vi','VND',NULL),(38,'vothikimngan@dienkim.vn','246357','Võ Thị Kim Ngân','912345671','Hopstarter-Bioman-Bioman-Avatar-5-Pink.512.png','vi','VND',NULL),(39,'tranthiloi@dienkim.vn','246357','Trần Thị Lợi','946708251','Hopstarter-Bioman-Bioman-Avatar-4-Yellow.512.png','vi','VND',NULL),(40,'daothimo@dienkim.vn','246357','Đào Thị Mỏ','903456781','Hopstarter-Superhero-Avatar-Avengers-Loki.256.png','vi','VND',NULL),(41,'nguyenhuynhphuonguyen@dienkim.vn','246357','Nguyễn Huỳnh Phương Uyên','908734261','Hopstarter-Superhero-Avatar-Avengers-Iron-Man.256.png',NULL,NULL,NULL),(42,'truongphucthich@dienkim.vn','246357','Trương Phúc Thịnh','967823471','Hopstarter-Superhero-Avatar-Avengers-Nick-Fury.256.png',NULL,NULL,NULL),(43,'tranthilongdom@dienkim.vn','246357','Trần Thị Long Đờm','924560371','Iconarchive-Incognito-Animals-Mouse-Avatar.512.png','vi','VND',NULL),(44,'tranthilat@dienkim.vn','246357','Trần Thị Lát','946702381','Iconarchive-Incognito-Animals-Owl-Avatar.512.png','vi','VND',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'my_dreamerly'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-16  5:47:28
