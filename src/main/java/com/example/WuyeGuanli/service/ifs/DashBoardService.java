package com.example.WuyeGuanli.service.ifs;

import com.example.WuyeGuanli.vo.DashBoardSearchByReq;
import com.example.WuyeGuanli.vo.DashBoardSearchRes;

public interface DashBoardService {
    public DashBoardSearchRes getAll();

    public DashBoardSearchRes getDashBoardsBy(DashBoardSearchByReq req);
}
