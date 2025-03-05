package com.example.WuyeGuanli.vo;

import java.util.List;

public class FeeInfoRes extends BasicRes {
	private String address;
	private int year;
	private int season;
	private boolean isPaid;
	private String content;
	//List<String> other;

	public FeeInfoRes() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FeeInfoRes(String address, int year, int season, boolean isPaid, String content) {
		super();
		this.address = address;
		this.year = year;
		this.season = season;
		this.isPaid = isPaid;
		this.content = content;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public int getSeason() {
		return season;
	}

	public void setSeason(int season) {
		this.season = season;
	}

	public boolean isPaid() {
		return isPaid;
	}

	public void setPaid(boolean isPaid) {
		this.isPaid = isPaid;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public FeeInfoRes(int statusCode, String message) {
		super(statusCode, message);
		// TODO Auto-generated constructor stub
	}

}
