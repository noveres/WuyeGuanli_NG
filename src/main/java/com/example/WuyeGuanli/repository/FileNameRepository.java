package com.example.WuyeGuanli.repository;

import com.example.WuyeGuanli.entity.FileNameEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileNameRepository extends JpaRepository<FileNameEntity, Long> {
    // 可以在這裡定義自定義查詢方法
}
