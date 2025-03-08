package com.example.WuyeGuanli.repository;

import com.example.WuyeGuanli.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    // 根據類型查詢
    List<Report> findBySort(String sort);
    
    // 根據狀態查詢
    List<Report> findByIsRepaired(Integer isRepaired);
    
    // 根據描述或位置包含關鍵詞查詢
    List<Report> findByDescriptionContainingOrLocationContaining(String descriptionKeyword, String locationKeyword);
    
    // 根據類型和狀態查詢
    List<Report> findBySortAndIsRepaired(String sort, Integer isRepaired);
}
