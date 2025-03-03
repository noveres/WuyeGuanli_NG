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
