package com.example.WuyeGuanli.repository;

import com.example.WuyeGuanli.entity.DashBoard;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DashBoardDao {
    // 進去網頁的時候撈全部資料
    List<DashBoard> findAll();
}
