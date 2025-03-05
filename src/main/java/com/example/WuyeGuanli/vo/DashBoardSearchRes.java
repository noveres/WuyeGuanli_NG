package com.example.WuyeGuanli.vo;

import com.example.WuyeGuanli.entity.DashBoard;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashBoardSearchRes extends BasicRes {
    private List<DashBoard> dashBoardList;

    public DashBoardSearchRes(int statusCode, String message, List<DashBoard> dashBoardList) {
        super(statusCode, message);
        this.dashBoardList = dashBoardList;
    }

}
