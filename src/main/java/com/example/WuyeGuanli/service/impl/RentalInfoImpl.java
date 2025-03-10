package com.example.WuyeGuanli.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.WuyeGuanli.entity.RentalInfo;
import com.example.WuyeGuanli.repository.RentalInfoRepository;
import com.example.WuyeGuanli.service.ifs.RentalInfoService;
import com.example.WuyeGuanli.vo.RentalInfoRes;

@Service
public class RentalInfoImpl implements RentalInfoService {

	@Autowired
	private RentalInfoRepository rentalInfoRepository;

	@Override
	public RentalInfoRes addRental(RentalInfoRes rentalInfoRes) {
		RentalInfo rentalInfo = new RentalInfo();
		rentalInfo.setIdrental(rentalInfoRes.getIdrental());
		rentalInfo.setItem(rentalInfoRes.getItem());
		rentalInfo.setTotal(rentalInfoRes.getTotal());
		rentalInfo.setRemark(rentalInfoRes.getRemark());
		rentalInfoRepository.save(rentalInfo);
		return new RentalInfoRes(200, "新增成功", rentalInfoRes.getIdrental(), rentalInfoRes.getItem(),
				rentalInfoRes.getTotal(), rentalInfoRes.getRemark()); // 不是這邊返還回給前端
	}

	@Override
	public RentalInfoRes deleteByPK(int idrental) {
		rentalInfoRepository.deleteById(idrental);
		return null;
	}

	@Override
	public List<RentalInfo> getAll() {
		
		return rentalInfoRepository.findAll();

	}

}
