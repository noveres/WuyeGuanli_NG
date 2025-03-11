package com.example.WuyeGuanli.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.WuyeGuanli.dao.FinancialDao;
import com.example.WuyeGuanli.dto.LoginRequest;
import com.example.WuyeGuanli.dto.LoginResponse;
import com.example.WuyeGuanli.vo.BasicRes;
import com.example.WuyeGuanli.vo.FinancialAddInfoReq;


@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class FinancialController {
	
	@Autowired FinancialDao financialDao;
	
	@PostMapping("/Financial/addInfo")
	public int addInfo(@RequestBody FinancialAddInfoReq req) {
		financialDao.addInfoDao(req.getProject(),req.getIncome(),req.getExpenditure(),null, req.getRemark(),req.getReceipt());
		return 200;
	}
	
}
