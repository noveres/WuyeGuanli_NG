package com.example.WuyeGuanli.dao;

import com.example.WuyeGuanli.entity.DashBoard;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface DashBoardDao {
    // 進去網頁的時候撈全部資料
    public List<DashBoard> getAll();

    // 根據條件抓資料
    public List<DashBoard> getDashBoardsBy(
            @Param("header")String header,
            @Param("startDate")LocalDate startDate,
            @Param("endDate")LocalDate endDate);
}
