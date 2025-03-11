package com.example.WuyeGuanli.dao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.WuyeGuanli.entity.VisitorRecords;

import jakarta.transaction.Transactional;

@Repository
public interface VisitorRecordsDao extends JpaRepository<VisitorRecords, Integer> 
{
	
	
	@Query(value = "SELECT * FROM visitor_records WHERE visitor_id = ?1 ",nativeQuery = true)
	public int gitId(int id);
	
	@Modifying
	@Transactional
	@Query(value = "INSERT INTO visitor_records (visitor_name, visitor_phone , visitor_reason, visitors) VALUES (?1,?2,?3,?4)" ,nativeQuery = true)
	public int Add(String name ,String phone ,String reson , String Visitors);
	
	
	@Modifying
	@Transactional
	@Query(value = "UPDATE visitor_records SET is_out_visitors = ?2 WHERE visitor_id = ?1" ,nativeQuery = true)
	public int getIdByleave(int id , boolean isLeave);
	
	@Query(value = "SELECT * FROM visitor_records",nativeQuery = true)
	public List<VisitorRecords> gitAll();
}
