package com.example.WuyeGuanli.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;




@Entity
@Table(name = "visitor_records")
public class VisitorRecords {

	// 1.造訪這姓名
	// 2.造訪時間
	// 3.造訪者電話
	// 4.造訪原因
	// 5.造訪對象
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	@Column(name = "visitor_id")
	private int ai;
	@Column(name = "visitor_name")
	private String visitorName;
	@Column(name = "visitor_phone")
	private String visitorPhone;
	@Column(name = "Visitor_reason")
	private String visitorReason;
	@Column(name = "Visitors")
	private String Visitors;

	public VisitorRecords() {
		super();
		// TODO Auto-generated constructor stub
	}

	public VisitorRecords(int ai, String visitorName, String visitorPhone, String visitorReason, String visitors) {
		super();
		this.ai = ai;
		this.visitorName = visitorName;
		this.visitorPhone = visitorPhone;
		this.visitorReason = visitorReason;
		Visitors = visitors;
	}

	public int getAi() {
		return ai;
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
		return Visitors;
	}
}
