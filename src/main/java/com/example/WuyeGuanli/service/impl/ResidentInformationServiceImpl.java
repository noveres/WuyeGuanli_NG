package com.example.WuyeGuanli.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.WuyeGuanli.vo.BasicRes;
import com.example.WuyeGuanli.vo.DeleteinformationReq;
import com.example.WuyeGuanli.vo.UpdateReq;
import com.example.WuyeGuanli.vo.addinfoReq;
import com.example.WuyeGuanli.dao.ResidentInformationDaoNMSL;
import com.example.WuyeGuanli.entity.Resident_Information;
import com.example.WuyeGuanli.service.ifs.ResidentInformationService;

import jakarta.transaction.Transactional;

@Service
public class ResidentInformationServiceImpl implements ResidentInformationService {

	@Autowired
	ResidentInformationDaoNMSL residentDao;

	@Transactional(rollbackOn = Exception.class)
	@Override
	public BasicRes addinfo(addinfoReq req) {

		String patternString = "\\d{8}";
		// 檢查房東手機
		if (!req.getOwerPhone().matches(patternString)) {
			System.out.println(req.getOwerPhone());
			System.out.println(req.getOwerPhone().matches(patternString));
			System.out.println("手機號碼有誤");
			return null;
		}
		patternString = "[A-C]\\d{2}";
		// 判斷門牌號碼
		if (!req.getPartitionhousenumber().matches(patternString)) {
			return null;
		}
		// 判斷是否出租
		if (req.isLease()) {
			// 檢查租戶名字
			if (!StringUtils.hasText(req.getResidentname())) {
				return null;
			}
			// 檢查租戶手機
			if (!StringUtils.hasText(req.getResidentphonenumber())
					|| req.getPartitionhousenumber().matches(patternString)) {
				return null;
			}
		}
		residentDao.Add(req.getPartitionhousenumber(), req.getOwerName(), req.getOwerPhone(), req.isLease(),
				req.getResidentname(), req.getResidentphonenumber());
		return null;
	}

	@Override
	public BasicRes selectAll() {

		residentDao.selectAll();
		// List<Resident_Information> res = residentDao.selectAll();
		// System.out.println(res.);
		return null;
	}

	@Override
	public BasicRes searchName(String owerName) {
		List<Resident_Information> res = residentDao.gatOwnerNameByAll(owerName);
		for (Resident_Information resident_Information : res) {
			System.out.println(res);
		}

		return null;
	}

	@Override
	public BasicRes deleteinformation(DeleteinformationReq req) {
		System.out.println(req.getPartitionhousenumber());
		residentDao.deleteinformation(req.getPartitionhousenumber());

		return null;
	}

	@Override
	public BasicRes updateinformation(UpdateReq req) 
	{
		String patternString = "\\d{8}";
		Resident_Information res = residentDao.gatPartitionhousenumberByAll(req.getPartitionhousenumber());
		if(!StringUtils.hasText(res.getPartitionhousenumber()))
		{
			return null;
		}
		if (!req.getOwerPhone().matches(patternString)) {
			System.out.println(req.getOwerPhone());
			System.out.println(req.getOwerPhone().matches(patternString));
			System.out.println("手機號碼有誤");
			return null;
		}
		patternString = "[A-C]\\d{2}";
		// 判斷門牌號碼
		if (!req.getPartitionhousenumber().matches(patternString)) {
			return null;
		}
		// 判斷是否出租
		if (req.isLease()) {
			// 檢查租戶名字
			if (!StringUtils.hasText(req.getResidentname())) {
				return null;
			}
			// 檢查租戶手機
			if (!StringUtils.hasText(req.getResidentphonenumber())
					|| req.getPartitionhousenumber().matches(patternString)) {
				return null;
			}
		}
		residentDao.updateByPartitionhousenumber(req.getPartitionhousenumber(),req.getOwerName(),req.getOwerPhone(),req.isLease(),req.getResidentname(),req.getResidentphonenumber());
		return null;
	}
}
