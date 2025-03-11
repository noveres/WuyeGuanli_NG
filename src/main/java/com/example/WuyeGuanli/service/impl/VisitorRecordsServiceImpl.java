package com.example.WuyeGuanli.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.WuyeGuanli.vo.BasicRes;
import com.example.WuyeGuanli.vo.VisitorAddReq;
import com.example.WuyeGuanli.vo.VisitorleaveReq;
import com.example.WuyeGuanli.dao.ResidentInformationDaoNMSL;
import com.example.WuyeGuanli.dao.VisitorRecordsDao;
import com.example.WuyeGuanli.entity.Resident_Information;
import com.example.WuyeGuanli.entity.VisitorRecords;
import com.example.WuyeGuanli.service.ifs.VisitorRecordsService;

import jakarta.transaction.Transactional;

@Service
public class VisitorRecordsServiceImpl implements VisitorRecordsService {
	@Autowired
	VisitorRecordsDao visDao;
	
	@Autowired
	ResidentInformationDaoNMSL residentDao;
	
	@Transactional(rollbackOn = Exception.class)
	@Override
	public BasicRes addinfo(VisitorAddReq req) {
		
		String patternString = "\\d{8}";
		// 檢查訪客手機
		if (!req.getVisitorPhone().matches(patternString)) {
			System.out.println(req.getVisitorPhone());
			System.out.println(req.getVisitorPhone().matches(patternString));
			System.out.println("手機號碼有誤");
			return null;
		}
		//檢查對象是否存在
		String VisitorStr = req.getVisitors().substring(0,3);
		Resident_Information resident_Information = residentDao.gatPartitionhousenumberByAll(VisitorStr);
		if (!StringUtils.hasText(resident_Information.getPartitionhousenumber()))
		{
			System.out.println("查無此門牌");
			return null;
		}
		VisitorStr = req.getVisitors().substring(4);
		
		if (!resident_Information.isLease()) 
		{
			
			if (resident_Information.getOwerName().equals(req.getVisitorName()))
			{
				
				System.out.println("查無此人");
				return null;
			}
		}
		else 
		{
			if (!resident_Information.getOwerName().equals(req.getVisitorName()))
			{
				System.out.println("查無此人");
				return null;
			}
		}
		
		System.out.println("成功");
		visDao.Add(req.getVisitorName(),req.getVisitorPhone() ,req.getVisitorReason() , req.getVisitors());
		return null;
	}

	@Override
	public BasicRes leave(VisitorleaveReq req) 
	{
		int res = visDao.gitId(req.getId());
		
		if (res != req.getId()) 
		{
			System.out.println("查無此資料");
			return null;
		}
		System.out.println("離開成功");
		visDao.getIdByleave(req.getId(),req.isLeave());
		return null;
	}

	@Override
	public BasicRes getAll() 
	{
		List<VisitorRecords> resList = visDao.gitAll();
		
		System.out.println(resList);
		// TODO Auto-generated method stub
		return null;
	}

}
