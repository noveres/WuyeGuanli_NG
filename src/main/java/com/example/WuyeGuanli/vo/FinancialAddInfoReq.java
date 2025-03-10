package com.example.WuyeGuanli.vo;

import java.time.LocalDate;

public class FinancialAddInfoReq extends BasicRes{
	
	String project;
	
	int income;
	
	int expenditure;
	
	LocalDate date;
	
	String remark;
	
	String receipt;

	public FinancialAddInfoReq( String project, int income, int expenditure, LocalDate date, String remark,String receipt) {
		this.project = project;
		this.income = income;
		this.expenditure = expenditure;
		this.date = date;
		this.remark = remark;
		this.receipt = receipt;
	}
	
	public FinancialAddInfoReq(int statusCode,String message) {
		super(statusCode, message);
		
	}

	public FinancialAddInfoReq() {
		super();
		
	}

	public String getProject() {
		return project;
	}

	public int getIncome() {
		return income;
	}

	public int getExpenditure() {
		return expenditure;
	}

	public LocalDate getDate() {
		return date;
	}

	public String getRemark() {
		return remark;
	}

	public String getReceipt() {
		return receipt;
	}
	
	
	
}
