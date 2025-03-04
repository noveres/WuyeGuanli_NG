package com.example.WuyeGuanli.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.WuyeGuanli.entity.FeeInfo;
import com.example.WuyeGuanli.service.ifs.FeeInfoService;
import com.example.WuyeGuanli.vo.BasicRes;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@CrossOrigin
@RestController
public class FeeController {

	@Autowired
	private FeeInfoService feeInfoService;

	@PostMapping("fee/add")
	public BasicRes saveFeeInfo(@RequestBody FeeInfo feeInfo) {
		return null ;
	}
}
