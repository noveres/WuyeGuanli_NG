package com.example.WuyeGuanli.vo;

import lombok.Data;

import java.time.LocalDate;

@Data
public class DashBoardSearchByReq {
    private String header;
    private LocalDate startDate;
    private LocalDate endDate;
}
