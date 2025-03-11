package com.example.WuyeGuanli.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "rental")
public class RentalInfo {

	@GeneratedValue(strategy = GenerationType.IDENTITY) 
	@Id
	@Column(name = "idrental")
	private Integer  idrental;
	
	@Column(name = "item")
	private String item;
	
	@Column(name = "total")
	private int total;
	
	@Column(name = "remark")
	private String remark;

	public RentalInfo() {
		super();
		// TODO 自動產生的建構子 Stub
	}

	

	public Integer getIdrental() {
		return idrental;
	}



	public void setIdrental(Integer idrental) {
		this.idrental = idrental;
	}



	public RentalInfo(Integer idrental, String item, int total, String remark) {
		super();
		this.idrental = idrental;
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
	
	
	
}
