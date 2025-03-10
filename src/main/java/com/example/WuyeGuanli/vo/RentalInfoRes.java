package com.example.WuyeGuanli.vo;

public class RentalInfoRes extends BasicRes {
	private Integer  idrental;
	private String item;
	private int total;
	private String remark;
	public RentalInfoRes() {
		super();
		// TODO 自動產生的建構子 Stub
	}
	public RentalInfoRes(int statusCode, String message) {
		super(statusCode, message);
		// TODO 自動產生的建構子 Stub
	}
	public RentalInfoRes(Integer idrental,String item, int total, String remark) {
		super();
		this.idrental=idrental;
		this.item = item;
		this.total = total;
		this.remark = remark;
	}
	public RentalInfoRes(int statusCode, String message,Integer idrental,String item, int total, String remark) {
		super(statusCode, message);
		this.idrental=idrental;
		this.item = item;
		this.total = total;
		this.remark = remark;
	}
	public String getItem() {
		return item;
	}
	public void setItem(String item) {
		this.item = item;
	}
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Integer getIdrental() {
		return idrental;
	}
	public void setIdrental(Integer idrental) {
		this.idrental = idrental;
	}
	
}
