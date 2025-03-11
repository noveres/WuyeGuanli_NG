package com.example.WuyeGuanli.service.ifs;

import java.util.List;

import com.example.WuyeGuanli.entity.RentalInfo;
import com.example.WuyeGuanli.vo.RentalInfoRes;

public interface RentalInfoService {

	public RentalInfoRes addRental(RentalInfoRes rentalInfoRes) ;
	
	public RentalInfoRes deleteByPK(int idrental);
	
	public List<RentalInfo> getAll() ;
}
