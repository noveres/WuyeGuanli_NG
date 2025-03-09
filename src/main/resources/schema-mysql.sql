CREATE TABLE  IF NOT EXISTS `report`(
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sort` varchar(20) NOT NULL COMMENT '''種類:比如電梯、大門''',
  `location` varchar(20) NOT NULL COMMENT '''哪裡:比如A棟3F''',
  `where` varchar(20) DEFAULT NULL COMMENT '''維修位置''',
  `description` varchar(45) NOT NULL COMMENT '''描述''',
  `photo1` varchar(255) DEFAULT NULL,
  `photo2` varchar(255) DEFAULT NULL,
  `create_time` datetime NOT NULL,
  `process_time` datetime DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT '待處理',
  `isRepaired` tinyint unsigned NOT NULL DEFAULT '0',
  `cost` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `fee_info` (
  `address` varchar(45) NOT NULL,
  `other` varchar(445) DEFAULT NULL COMMENT '''["1134是","1141是"1142否只繳一半"]''',
  `modifying_date` date DEFAULT NULL COMMENT '更新一次刷新一次',
  PRIMARY KEY (`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='管理費';

CREATE TABLE IF NOT EXISTS `financial`(
  `id` int NOT NULL,
  `project` varchar(100) DEFAULT NULL,
  `income` int DEFAULT '0',
  `expenditure` int DEFAULT '0',
  `date` date DEFAULT NULL,
  `balance` int DEFAULT '0',
  `remark` varchar(200) DEFAULT NULL,
  `receipt` blob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `resident_information` (
  `Partitionhousenumber` varchar(20) NOT NULL,
  `Owner_Name` varchar(45) DEFAULT NULL,
  `Owner_Phone` varchar(45) DEFAULT NULL,
  `Lease` tinyint DEFAULT NULL,
  `Residentname` varchar(45) DEFAULT NULL,
  `Residentphonenumber` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Partitionhousenumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `users` (
`id` int NOT NULL AUTO_INCREMENT,
                         `name` varchar(255) DEFAULT NULL,
                         `identity_number` varchar(255) DEFAULT NULL,
                         `password` varchar(255) NOT NULL,
                         `role` enum('admin','landlord','tenant') NOT NULL,
                         `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
                         `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
                         `landlord_id` bigint DEFAULT NULL,
                         `is_currently_residing` tinyint(1) NOT NULL DEFAULT '1',
                         `avatar` varchar(255) DEFAULT NULL,
                         PRIMARY KEY (`id`),
                         KEY `fk_landlord` (`landlord_id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


    CREATE TABLE  IF NOT EXISTS  `file_names` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;;

 -- 維修請求表
 CREATE TABLE IF NOT EXISTS `requests` (
   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(45) NOT NULL COMMENT '描述',
   `sort` varchar(20) NOT NULL COMMENT '種類',
   `where` varchar(20) NOT NULL COMMENT '位置',
   `photo1` varchar(255) DEFAULT NULL COMMENT '照片1',
   `photo2` varchar(255) DEFAULT NULL COMMENT '照片2',
   `status` varchar(20) NOT NULL COMMENT '狀態',
   `is_repaired` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否已修復',
   `create_time` datetime NOT NULL COMMENT '創建時間',
   `process_time` datetime DEFAULT NULL COMMENT '處理時間',
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE  IF NOT EXISTS `report`(
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sort` varchar(20) NOT NULL COMMENT '''種類:比如電梯、大門''',
  `location` varchar(20) NOT NULL COMMENT '''哪裡:比如A棟3F''',
  `description` varchar(45) NOT NULL COMMENT '''描述''',
  `photo1` varchar(100) NOT NULL,
  `photo2` varchar(100) NOT NULL,
  `create_time` datetime NOT NULL,
  `process_time` datetime NOT NULL,
  `status` varchar(20) NOT NULL,
  `isRepaired` tinyint unsigned NOT NULL,
  `cost` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `fee_info` (
  `address` varchar(45) NOT NULL,
  `other` varchar(445) DEFAULT NULL COMMENT '''["1134是","1141是"1142否只繳一半"]''',
  `modifying_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '更新一次刷新一次',
  PRIMARY KEY (`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='管理費';


CREATE TABLE IF NOT EXISTS `financial`(
  `id` int NOT NULL,
  `project` varchar(100) DEFAULT NULL,
  `income` int DEFAULT '0',
  `expenditure` int DEFAULT '0',
  `date` date DEFAULT NULL,
  `balance` int DEFAULT '0',
  `remark` varchar(200) DEFAULT NULL,
  `receipt` blob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `resident_information` (
  `Partitionhousenumber` varchar(20) NOT NULL,
  `Owner_Name` varchar(45) DEFAULT NULL,
  `Owner_Phone` varchar(45) DEFAULT NULL,
  `Lease` tinyint DEFAULT NULL,
  `Residentname` varchar(45) DEFAULT NULL,
  `Residentphonenumber` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Partitionhousenumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 確保表格存在並創建
CREATE TABLE IF NOT EXISTS `users` (
 
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50) NOT NULL,
identity_number VARCHAR(20),
password VARCHAR(255) NOT NULL,
role ENUM('admin', 'landlord', 'tenant') NOT NULL,
landlord_id INT NULL,
is_currently_residing BOOLEAN NOT NULL DEFAULT TRUE,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_landlord FOREIGN KEY (landlord_id) REFERENCES `users`(id)  -- 修正為小寫
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


 --DROP TRIGGER IF EXISTS before_users_update;

 --CREATE TRIGGER before_users_update
 --    BEFORE UPDATE ON Users
 --    FOR EACH ROW
 --    SET NEW.updated_at = CURRENT_TIMESTAMP;

    CREATE TABLE IF NOT EXISTS `file_names` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    
 CREATE TABLE IF NOT EXISTS `rental` (
  `idrental` int NOT NULL AUTO_INCREMENT,
  `item` varchar(255) NOT NULL,
  `total` int NOT NULL DEFAULT '0' COMMENT '總共數量',
  `remark` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idrental`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='公共器材租借';



