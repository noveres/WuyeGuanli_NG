package com.example.WuyeGuanli.repository;

import com.example.WuyeGuanli.entity.DashBoard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DashboardRepository extends JpaRepository<DashBoard, Integer> {
    
    // 根據類型查詢
    List<DashBoard> findBySort(String sort);
    
    // 根據標題關鍵字查詢
    List<DashBoard> findByHeaderContaining(String keyword);
}
