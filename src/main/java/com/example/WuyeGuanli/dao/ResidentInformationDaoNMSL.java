package com.example.WuyeGuanli.dao;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.WuyeGuanli.entity.Resident_Information;
import jakarta.transaction.Transactional;

@Repository
public interface ResidentInformationDaoNMSL extends JpaRepository<Resident_Information, String>
{
	
	@Modifying
	@Transactional
	@Query(value = "INSERT INTO resident_information (Partitionhousenumber, Owner_Name, Owner_Phone, Lease, Residentname, Residentphonenumber) VALUES (?1,?2,?3,?4,?5,?6)" ,nativeQuery = true)
	public int Add(String partitionhousenumber, String owerName, String owerPhone, boolean lease,String residentname, String residentphonenumber);
	
	
	
	@Query(value = "SELECT * FROM resident_information" ,nativeQuery = true)
	public List<Resident_Information> selectAll();
	

	@Query(value = "SELECT * FROM resident_information WHERE Owner_Name like %?1% ",nativeQuery = true)
	public List<Resident_Information> gatOwnerNameByAll(String owerName );
	
	@Query(value = "SELECT * FROM resident_information WHERE Partitionhousenumber = ?1 ",nativeQuery = true)
	public Resident_Information gatPartitionhousenumberByAll(String partitionhousenumber);
	
	
	@Transactional
	@Modifying
	@Query(value = "DELETE FROM resident_information WHERE Partitionhousenumber IN(?1) ",nativeQuery = true)
	public int deleteinformation(String partitionhousenumber);
	
	@Modifying
	@Transactional
	@Query(value = "UPDATE resident_information SET Owner_Name = ?2, Owner_Phone = ?3, Lease = ?4, Residentname = ?5, Residentphonenumber = ?6 WHERE Partitionhousenumber = ?1;" ,nativeQuery = true)
	public int updateByPartitionhousenumber(String partitionhousenumber, String owerName, String owerPhone, boolean lease,String residentname, String residentphonenumber);
	
	
}
