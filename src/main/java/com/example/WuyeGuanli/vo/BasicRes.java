package com.example.WuyeGuanli.vo;

public class BasicRes {
	private int statusCode;

	private String message;

	public BasicRes() {
		super();
		// TODO 自動產生的建構子 Stub
	}

	public BasicRes(int statusCode, String message) {
		super();
		this.statusCode = statusCode;
		this.message = message;
	}

	public int getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
	
}
