package com.example.WuyeGuanli.service.ifs;

import org.springframework.stereotype.Service;

import com.example.WuyeGuanli.entity.FeeInfo;
import com.example.WuyeGuanli.vo.BasicRes;


public interface FeeInfoService {
	public BasicRes saveFeeInfo(FeeInfo feeInfo);
}
