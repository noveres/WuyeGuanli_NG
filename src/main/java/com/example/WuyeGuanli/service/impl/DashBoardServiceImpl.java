package com.example.WuyeGuanli.service.impl;

import com.example.WuyeGuanli.dao.DashBoardDao;
import com.example.WuyeGuanli.entity.DashBoard;
import com.example.WuyeGuanli.service.ifs.DashBoardService;
import com.example.WuyeGuanli.vo.DashBoardSearchByReq;
import com.example.WuyeGuanli.vo.DashBoardSearchByRes;
import com.example.WuyeGuanli.vo.DashBoardSearchRes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.List;

@Service
public class DashBoardServiceImpl implements DashBoardService {

    @Autowired
    private DashBoardDao dashBoardDao;


    @Override
    public DashBoardSearchRes getAll() {
        List<DashBoard> dashBoardList = dashBoardDao.getAll();
        return new DashBoardSearchRes(200, "success", dashBoardList);
    }

    @Override
    public DashBoardSearchRes getDashBoardsBy(DashBoardSearchByReq req) {
        // 若Name沒有條件，前端帶過的資料可能是空字串或是Null
        // 要改變條件值:如果是NULL 或是空字串 或是 空白字串，一律改成空字串
        // 因為用% Like的時候是撈全部資料
        String header = req.getHeader();
        if (!StringUtils.hasText(header)) {
            // SQL語法中，欄位like %% (兩個%中間是空字串) 表示會忽略該欄位的條件值
            header = "";
        }

        // 設一個很大的range確保抓的到全部的資料
        LocalDate startDate = req.getStartDate();
        if (startDate == null) { //startDate == null 表示開始時間此欄位前端沒有帶值
            // 沒有帶值，可以直接指定時間到一個很早的時間點
            startDate = LocalDate.of(1970, 1, 1);
        }
        LocalDate endDate = req.getEndDate();
        if (endDate == null) {
            endDate = LocalDate.of(2999, 12, 31);
        }
        List<DashBoard> res = dashBoardDao.getDashBoardsBy(header, startDate, endDate);
        return new DashBoardSearchRes(200, "success", res);
    }
}
