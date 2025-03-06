package com.example.WuyeGuanli.vo;

import com.example.WuyeGuanli.entity.Resident_Information;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;

public class DeleteinformationReq extends BasicRes {
	@NotNull
	private String partitionhousenumber;

	public DeleteinformationReq() {
		super();
		// TODO Auto-generated constructor stub
	}

	public DeleteinformationReq(int statusCode, String message) {
		super(statusCode, message);
		// TODO Auto-generated constructor stub
	}

	public DeleteinformationReq(@NotNull String partitionhousenumber) {
		super();
		this.partitionhousenumber = partitionhousenumber;
	}

	public String getPartitionhousenumber() {
		return partitionhousenumber;
	}

}
