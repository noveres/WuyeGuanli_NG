package com.example.WuyeGuanli.vo;

import jakarta.validation.constraints.NotNull;

public class VisitorAddReq extends BasicRes {

	@NotNull
	private String visitorName;
	@NotNull
	private String visitorPhone;
	@NotNull
	private String visitorReason;
	@NotNull
	private String visitors;

	public VisitorAddReq() {
		super();
		// TODO Auto-generated constructor stub
	}

	public VisitorAddReq(int statusCode, String message) {
		super(statusCode, message);
		// TODO Auto-generated constructor stub
	}

	public VisitorAddReq(@NotNull String visitorName, @NotNull String visitorPhone, @NotNull String visitorReason,
			@NotNull String visitors) {
		super();
		this.visitorName = visitorName;
		this.visitorPhone = visitorPhone;
		this.visitorReason = visitorReason;
		this.visitors = visitors;
	}

	public String getVisitorName() {
		return visitorName;
	}

	public String getVisitorPhone() {
		return visitorPhone;
	}

	public String getVisitorReason() {
		return visitorReason;
	}

	public String getVisitors() {
		return visitors;
	}

}
