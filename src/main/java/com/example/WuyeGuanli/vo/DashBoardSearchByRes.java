package com.example.WuyeGuanli.vo;

import com.example.WuyeGuanli.entity.DashBoard;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashBoardSearchByRes extends BasicRes{
    List<DashBoard> dashBoardList;

    public DashBoardSearchByRes(int i, String success, List<DashBoard> res) {
    }
}
