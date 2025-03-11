package com.example.WuyeGuanli.controller;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.WuyeGuanli.entity.FeeInfo;
import com.example.WuyeGuanli.service.ifs.FeeInfoService;
import com.example.WuyeGuanli.vo.BasicRes;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
public class FeeController {

	@Autowired
	private FeeInfoService feeInfoService;

	// 用來新增資料的 POST 方法
	@PostMapping("/fee/add")
	public BasicRes saveFeeInfoList(@RequestBody List<FeeInfo> feeInfoList) {
		int successCount = 0;

		for (FeeInfo feeInfo : feeInfoList) {
			feeInfo.setModifyingDate(LocalDateTime.now()); // 刷新設置時間
			boolean isSaved = feeInfoService.saveFeeInfo(feeInfo);
			if (isSaved) {
				successCount++;
			}
		}

		if (successCount == feeInfoList.size()) {
			return new BasicRes(200, "全部 " + successCount + " 筆資料新增成功");
		} else {
			return new BasicRes(400, "有 " + (feeInfoList.size() - successCount) + " 筆資料新增失敗");
		}
	}

	// 用來獲取所有資料的 GET 方法
	@GetMapping("/fee/getall")
	public List<FeeInfo> getAll() {
		return feeInfoService.getAllFeeInfo();
	}

	// 用來獲取指定門牌地址資料的 GET 方法 (如果要獲得門牌地址 就用上面getAll())
	@GetMapping("/fee/getbyid")
	public List<FeeInfo> getByAddress(@RequestParam(name="address",required = false) String address) {
		if (address == null || address.isEmpty()) {
			return Collections.emptyList(); // 返回空陣列，讓前端自己處理提示
			// 一般是要用FeeRes當資料型態 這Res會繼承BasicRes 所以可以 new FeeRes (404,"not found") 但我這邊沒用
			// 所以返回空 改成前端自己弄提示
		}
		return feeInfoService.getByAddress(address);
	}
}
