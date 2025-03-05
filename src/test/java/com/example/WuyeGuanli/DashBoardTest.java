package com.example.WuyeGuanli;

import com.example.WuyeGuanli.entity.DashBoard;
import com.example.WuyeGuanli.dao.DashBoardDao;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;

@SpringBootTest
public class DashBoardTest {
    @Autowired
    private DashBoardDao dashBoardDao;

    @Test
    public void findTest() { // JUnit 5 建議使用無返回值的 void 方法
        List<DashBoard> list = dashBoardDao.getAll();
        // 遍歷list並印出每個DashBoard的屬性
        for (DashBoard dashBoard : list) {
            System.out.println(dashBoard.getId());
            System.out.println(dashBoard.getDate());
            System.out.println(dashBoard.getSort());
            System.out.println(dashBoard.getHeader());
            System.out.println(dashBoard.getContent());
            System.out.println(dashBoard.getImgUrl());
        }
    }

    @Test
    public void testGetDashBoardsBy() {
        List<DashBoard> list = dashBoardDao.getDashBoardsBy("公告",  LocalDate.of(2025, 6, 17), LocalDate.of(2025, 7, 1));
        for (DashBoard dashBoard : list) {
            System.out.println(dashBoard.getHeader());
            System.out.println(dashBoard.getDate());
        }
    }

}
