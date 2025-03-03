CREATE TABLE  IF NOT EXISTS `report`(
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sort` varchar(20) NOT NULL COMMENT '''種類:比如電梯、大門''',
  `where` varchar(20) NOT NULL COMMENT '''哪裡:比如A棟3F''',
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

CREATE TABLE IF NOT EXISTS `user` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    identity_number VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'landlord', 'tenant') NOT NULL,
    landlord_id INT NULL,
    is_currently_residing BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_landlord FOREIGN KEY (landlord_id) REFERENCES Users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TRIGGER IF EXISTS before_users_update;

CREATE TRIGGER before_users_update
    BEFORE UPDATE ON Users
    FOR EACH ROW
    SET NEW.updated_at = CURRENT_TIMESTAMP;

INSERT INTO Users (name, identity_number, password, role, landlord_id) VALUES
('系統管理員', 'A000000001', 'adminpassword', 'admin', NULL),
('房東1', 'B000000001', 'landlordpassword', 'landlord', NULL),
('房東2', 'B000000002', 'landlordpassword', 'landlord', NULL),
('房客1', 'C000000001', 'C000000001', 'tenant', 2),
('房客2', 'C000000002', 'C000000002', 'tenant', 2),
('房客3', 'C000000003', 'C000000003', 'tenant', 3),
('房客4', 'C000000004', 'C000000004', 'tenant', 3),
('房客5', 'C000000005', 'C000000005', 'tenant', 2),
('房客6', 'C000000006', 'C000000006', 'tenant', 3),
('房客7', 'C000000007', 'C000000007', 'tenant', 3);


