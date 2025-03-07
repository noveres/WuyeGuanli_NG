package com.example.WuyeGuanli.vo;

import jakarta.validation.constraints.NotNull;

public class UpdateReq extends BasicRes {
	@NotNull
	private String partitionhousenumber;
	@NotNull
	private String owerName;
	@NotNull
	private String owerPhone;
	@NotNull
	private boolean lease;

	private String residentname;

	private String residentphonenumber;

	
	
	public UpdateReq() {
		super();
		// TODO Auto-generated constructor stub
	}

	public UpdateReq(int statusCode, String message) {
		super(statusCode, message);
		// TODO Auto-generated constructor stub
	}

	public UpdateReq(@NotNull String partitionhousenumber, @NotNull String owerName, @NotNull String owerPhone,
			@NotNull boolean lease, String residentname, String residentphonenumber) {
		super();
		this.partitionhousenumber = partitionhousenumber;
		this.owerName = owerName;
		this.owerPhone = owerPhone;
		this.lease = lease;
		this.residentname = residentname;
		this.residentphonenumber = residentphonenumber;
	}

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
	
	

}
