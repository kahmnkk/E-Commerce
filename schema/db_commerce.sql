CREATE DATABASE IF NOT EXISTS `db_commerce`;
USE `db_commerce`;

DROP TABLE IF EXISTS `tb_commerce_store`;
CREATE TABLE `tb_commerce_store` (
  `id` varchar(254) NOT NULL,
  `name` varchar(254) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateTime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Customer Info';

DROP TABLE IF EXISTS `tb_commerce_customer`;
CREATE TABLE `tb_commerce_customer` (
  `id` varchar(254) NOT NULL,
  `store` varchar(254) NOT NULL,
  `name` varchar(254) NOT NULL,
  `email` varchar(254) NOT NULL,
  `password` varchar(254) NOT NULL,
  `custom` json NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateTime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`store`) REFERENCES `tb_commerce_store` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Customer Info';

DROP TABLE IF EXISTS `tb_commerce_product`;
CREATE TABLE `tb_commerce_product` (
  `id` varchar(254) NOT NULL,
  `store` varchar(254) NOT NULL,
  `name` varchar(254) NOT NULL,
  `price` int unsigned NOT NULL,
  `categories` json NOT NULL,
  `custom` json NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateTime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`store`) REFERENCES `tb_commerce_store` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Product Info';

DROP TABLE IF EXISTS `tb_commerce_order`;
CREATE TABLE `tb_commerce_order` (
  `id` varchar(254) NOT NULL,
  `store` varchar(254) NOT NULL,
  `status` varchar(254) NOT NULL,
  `customer` varchar(254) NOT NULL,
  `products` json NOT NULL,
  `price` int unsigned NOT NULL,
  `custom` json NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateTime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`store`) REFERENCES `tb_commerce_store` (`id`),
  FOREIGN KEY (`customer`) REFERENCES `tb_commerce_customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Order Info';
