package com.example.WuyeGuanli;

import com.example.WuyeGuanli.entity.DashBoard;
import com.example.WuyeGuanli.repository.DashBoardDao;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class DashBoardTest {
    @Autowired
    private DashBoardDao dashBoardDao;

    @Test
    public void findTest() { // JUnit 5 建議使用無返回值的 void 方法
        List<DashBoard> list = dashBoardDao.findAll();
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
}
