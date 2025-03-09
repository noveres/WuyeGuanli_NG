package com.example.WuyeGuanli.service.impl;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.WuyeGuanli.dao.FeeInfoDAO;
import com.example.WuyeGuanli.entity.FeeInfo;
import com.example.WuyeGuanli.service.ifs.FeeInfoService;

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

	@Override
	public List<FeeInfo> getByAddress(String address) {
	    return feeInfoDAO.findById(address)
	                     .map(Collections::singletonList) // 將單個物件轉為 List
	                     .orElse(Collections.emptyList()); // 若找不到則回傳空 List
	}


}
