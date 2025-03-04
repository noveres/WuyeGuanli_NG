package com.example.WuyeGuanli.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "wuyeguanli")
public class FeeInfo {
	@Id
	@Column(name = "address")
	private String address;
	@Column(name = "other")
	private String other;
	@Column(name = "modifying_date")
	private LocalDateTime modifyingDate;

	public FeeInfo() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FeeInfo(String address, String other, LocalDateTime modifyingDate) {
		super();
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
