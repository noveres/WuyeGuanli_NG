package com.example.WuyeGuanli.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.WuyeGuanli.dao.FeeInfoDAO;
import com.example.WuyeGuanli.entity.FeeInfo;
import com.example.WuyeGuanli.service.ifs.FeeInfoService;
import com.example.WuyeGuanli.vo.BasicRes;

@Service
public class FeeInfoImpl implements FeeInfoService {

	@Autowired private FeeInfoDAO feeInfoDAO;
	
	@Override
	public BasicRes saveFeeInfo(FeeInfo feeInfo) {
		try {
			feeInfoDAO.save(feeInfo);
		} catch (Exception e) {
			// TODO: handle exception
		}
		 return new BasicRes(500,"");

	}

}
