package com.example.WuyeGuanli.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.WuyeGuanli.entity.FeeInfo;
import com.example.WuyeGuanli.dao.FeeInfoDAO;
import com.example.WuyeGuanli.service.ifs.FeeInfoService;
import com.example.WuyeGuanli.vo.FeeInfoRes;


import java.util.List;
import java.util.Optional;

@Service
public class FeeInfoServiceImpl implements FeeInfoService {

	@Autowired
	private FeeInfoDAO feeInfoDAO;

	@Override
	public List<FeeInfo> getAllFeeInfo() {
		return feeInfoDAO.findAll();
	}

	@Override
	public boolean saveFeeInfo(FeeInfo feeInfo) {
		try {
			feeInfoDAO.save(feeInfo); // 使用 save 方法保存 FeeInfo
			return true;
		} catch (Exception e) {
			e.printStackTrace(); // 打印錯誤信息
			return false;
		}
	}



}
