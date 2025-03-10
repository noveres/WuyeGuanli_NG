package com.example.WuyeGuanli.vo;

import java.time.LocalDate;

public class FinancialSearchReq extends BasicRes{
	
	private String name;
	
	private LocalDate sDate;
	
	private LocalDate eDate;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public LocalDate getsDate() {
		return sDate;
	}

	public void setsDate(LocalDate sDate) {
		this.sDate = sDate;
	}

	public LocalDate geteDate() {
		return eDate;
	}

	public void seteDate(LocalDate eDate) {
		this.eDate = eDate;
	}

	public FinancialSearchReq(String name, LocalDate sDate, LocalDate eDate) {
		super();
		this.name = name;
		this.sDate = sDate;
		this.eDate = eDate;
	}

	public FinancialSearchReq() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FinancialSearchReq(int statusCode, String message) {
		super(statusCode, message);
		// TODO Auto-generated constructor stub
	}
	
	
}
