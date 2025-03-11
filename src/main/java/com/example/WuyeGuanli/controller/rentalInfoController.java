package com.example.WuyeGuanli.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.WuyeGuanli.entity.RentalInfo;
import com.example.WuyeGuanli.service.ifs.RentalInfoService;
import com.example.WuyeGuanli.vo.RentalInfoRes;

@RestController
@CrossOrigin
public class rentalInfoController {

	@Autowired
	private RentalInfoService rentalInfoService;

	@PostMapping("rental/add") // 只能單筆增加 要多筆要用List<> 或用for硬改
	public RentalInfoRes addRental(@RequestBody RentalInfoRes rentalInfoRes) {
		rentalInfoService.addRental(rentalInfoRes);
		return new RentalInfoRes(200, "新增成功", rentalInfoRes.getIdrental(), rentalInfoRes.getItem(),
				rentalInfoRes.getTotal(), rentalInfoRes.getRemark());
	}

	@DeleteMapping("rental/delete/{idrental}")
	public RentalInfoRes deleteByPK(@PathVariable("idrental") int idrental) {
		rentalInfoService.deleteByPK(idrental);
		return new RentalInfoRes(200, "刪除成功");
	}
	
	@GetMapping("rental/getall")
	public List<RentalInfo> getAll() {
		return rentalInfoService.getAll();
	}
}
