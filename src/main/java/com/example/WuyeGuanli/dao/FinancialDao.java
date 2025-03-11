package com.example.WuyeGuanli.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.WuyeGuanli.entity.Financial;
import com.example.WuyeGuanli.vo.FinancialAddInfoReq;


import jakarta.transaction.Transactional;

@Repository
public interface FinancialDao extends JpaRepository<Financial, Integer> {
	
	@Modifying
	@Transactional
	@Query(value = "insert into financial (project,income,expenditure,date,remark,receipt) values (?1,?2,?3,?4,?5,?6)", nativeQuery = true)
	public int addInfoDao(String project1, int income1, int expenditure1, LocalDate date1, String remark1,String receipt1);
	
	@Query(value = "select * from financial where name like %?1% and start_date >= ?2 and end_date <= ?3", nativeQuery = true)
	public List<Financial> getQuiz(String name, LocalDate startDate, LocalDate endDate);
	
}
