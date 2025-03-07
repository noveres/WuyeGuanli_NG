package com.example.WuyeGuanli.controller;

import com.example.WuyeGuanli.service.ifs.DashBoardService;
import com.example.WuyeGuanli.vo.DashBoardSearchRes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class DashBoardServiceController {

    @Autowired
    private DashBoardService dashBoardService;

    @GetMapping("/dashboards/getAll")
    public DashBoardSearchRes getAll() {
        return dashBoardService.getAll();
    }
}
