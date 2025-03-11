package com.example.WuyeGuanli.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "resident_information")
public class Resident_Information {
	@Id
	@Column(name = "Partitionhousenumber")
	private String partitionhousenumber;
	@Column(name = "Owner_Name")
	private String owerName;
	@Column(name = "Owner_Phone")
	private String owerPhone;
	@Column(name = "Lease")
	private boolean lease;
	@Column(name = "Residentname")
	private String residentname;
	@Column(name = "Residentphonenumber")
	private String residentphonenumber;

	//建構式
	public Resident_Information() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Resident_Information(String partitionhousenumber, String owerName, String owerPhone, boolean lease,
			String residentname, String residentphonenumber) {
		super();
		this.partitionhousenumber = partitionhousenumber;
		this.owerName = owerName;
		this.owerPhone = owerPhone;
		this.lease = lease;
		this.residentname = residentname;
		this.residentphonenumber = residentphonenumber;
	}
	//----------------------------------------------------------------------------
	
	
	//以下為所有的get方法
	//1.門牌+區域
	//2.房東名字
	//3.房東電話
	
	//4.是否出租
	//5.租客名字
	//6.租客電話
	public String getPartitionhousenumber() {
		return partitionhousenumber;
	}

	public String getOwerName() {
		return owerName;
	}

	public String getOwerPhone() {
		return owerPhone;
	}

	public boolean isLease() {
		return lease;
	}

	public String getResidentname() {
		return residentname;
	}

	public String getResidentphonenumber() {
		return residentphonenumber;
	}
	//--------------------------------------------------

}
