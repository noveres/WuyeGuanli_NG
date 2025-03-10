package com.example.WuyeGuanli.service.ifs;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.WuyeGuanli.entity.FeeInfo;
import com.example.WuyeGuanli.vo.BasicRes;


public interface FeeInfoService {
	public boolean saveFeeInfo(FeeInfo feeInfo);
	
	public	List<FeeInfo> getAllFeeInfo();
	
	public	List<FeeInfo> getByAddress(String address);
	
}
