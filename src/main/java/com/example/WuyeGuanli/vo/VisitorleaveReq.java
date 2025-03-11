package com.example.WuyeGuanli.vo;

import jakarta.validation.constraints.NotNull;

public class VisitorleaveReq extends BasicRes {

	@NotNull
	private int id;

	@NotNull
	private boolean leave;

	public VisitorleaveReq() {
		super();
		// TODO Auto-generated constructor stub
	}

	public VisitorleaveReq(int statusCode, String message) {
		super(statusCode, message);
		// TODO Auto-generated constructor stub
	}

	public VisitorleaveReq(@NotNull int id, @NotNull boolean leave) {
		super();
		this.id = id;
		this.leave = leave;
	}

	public int getId() {
		return id;
	}

	public boolean isLeave() {
		return leave;
	}

}
