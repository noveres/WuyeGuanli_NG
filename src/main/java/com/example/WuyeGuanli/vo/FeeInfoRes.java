package com.example.WuyeGuanli.vo;

import java.time.LocalDateTime;
import java.util.List;

import com.example.WuyeGuanli.entity.FeeInfo;

public class FeeInfoRes extends BasicRes {
	private String address;
	
	private String other; 
	
	private LocalDateTime modifyingDate;

	public FeeInfoRes() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FeeInfoRes(int statusCode, String message) {
		super(statusCode, message);
		// TODO Auto-generated constructor stub
	}

	public FeeInfoRes(int statusCode, String message,String address, String other, LocalDateTime modifyingDate) {
		super(statusCode, message);
		this.address = address;
		this.other = other;
		this.modifyingDate = modifyingDate;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getOther() {
		return other;
	}

	public void setOther(String other) {
		this.other = other;
	}

	public LocalDateTime getModifyingDate() {
		return modifyingDate;
	}

	public void setModifyingDate(LocalDateTime modifyingDate) {
		this.modifyingDate = modifyingDate;
	}
	
	
	
	
}
