package com.example.WuyeGuanli.service.impl;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.WuyeGuanli.dao.FinancialDao;
import com.example.WuyeGuanli.service.ifs.FinancialService;
import com.example.WuyeGuanli.vo.BasicRes;
import com.example.WuyeGuanli.vo.FinancialAddInfoReq;

@Service
public class FinancialServiceImpl implements FinancialService{

	@Autowired FinancialDao financialDao;
	
	@Override
	public int addInfo(FinancialAddInfoReq req) {
		
		if (!StringUtils.hasText(req.getProject())) {
//			return new BasicRes(400,"項目名稱是必填");
			return 400;
		}
		
		if (req.getIncome() < 0) {
//			return new BasicRes(400,"收入金額不能為負的");
			return 400;
		}
		
		if (req.getExpenditure() < 0) {
//			return new BasicRes(400,"支出金額不能為負的");
			return 400;
		}
		
		if (req.getDate() == null) {
//			return new BasicRes(400,"請檢查日期是否正確");
			return 400;
		}
		
		financialDao.addInfoDao(req.getProject(),req.getIncome(),req.getExpenditure(),null, req.getRemark(),req.getReceipt());
//		return new BasicRes(200,"成功");
		return 200;
	}

	
	
}
