-- 修改 report 表的 isRepaired 欄位，添加預設值
ALTER TABLE report MODIFY COLUMN is_repaired INT NOT NULL DEFAULT 0;

-- 修改 report 表的 cost 欄位，添加預設值
ALTER TABLE report MODIFY COLUMN cost DOUBLE DEFAULT 0.0;

-- 修改 report 表的 status 欄位，添加預設值
ALTER TABLE report MODIFY COLUMN status VARCHAR(255) NOT NULL DEFAULT '待處理';
