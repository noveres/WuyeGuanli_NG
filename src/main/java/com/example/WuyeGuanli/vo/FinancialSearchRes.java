package com.example.WuyeGuanli.vo;

import java.util.List;

import com.example.WuyeGuanli.entity.Financial;

public class FinancialSearchRes extends BasicRes{
	
	private List<Financial> financials;

	public List<Financial> getFinancials() {
		return financials;
	}

	public void setFinancials(List<Financial> financials) {
		this.financials = financials;
	}

	public FinancialSearchRes(int statusCode, String message,List<Financial> financials) {
		super(statusCode, message);
		this.financials = financials;
	}

	public FinancialSearchRes() {
		super();
		
	}

	
	
	
}
