package com.example.WuyeGuanli.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "financial")
public class Financial {

	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	int id;

	@Column(name = "project")
	String project;

	@Column(name = "income")
	int income;

	@Column(name = "expenditure")
	int expenditure;

	@Column(name = "date")
	LocalDate date;

	@Column(name = "balance")
	int balance;

	@Column(name = "remark")
	String remark;

	@Column(name = "receipt")
	String receipt;

	public Financial() {
		super();

	}

	public Financial(int id, String project, int income, int expenditure, LocalDate date, int balance, String remark,
			String receipt) {
		super();
		this.id = id;
		this.project = project;
		this.income = income;
		this.expenditure = expenditure;
		this.date = date;
		this.balance = balance;
		this.remark = remark;
		this.receipt = receipt;
	}

	public int getId() {
		return id;
	}

	public String getProject() {
		return project;
	}

	public int getIncome() {
		return income;
	}

	public int getExpenditure() {
		return expenditure;
	}

	public LocalDate getDate() {
		return date;
	}

	public int getBalance() {
		return balance;
	}

	public String getRemark() {
		return remark;
	}

	public String getReceipt() {
		return receipt;
	}

}
