package com.example.WuyeGuanli.controller;

import com.example.WuyeGuanli.entity.DashBoard;
import com.example.WuyeGuanli.service.ifs.DashBoardService;
import com.example.WuyeGuanli.vo.DashBoardSearchByReq;
import com.example.WuyeGuanli.vo.DashBoardSearchRes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashBoardServiceController {
    @Autowired
    private DashBoardService dashBoardService;

    @GetMapping("/dashboards/getAll")
    public DashBoardSearchRes getAll() {
        return dashBoardService.getAll();
    }



}
