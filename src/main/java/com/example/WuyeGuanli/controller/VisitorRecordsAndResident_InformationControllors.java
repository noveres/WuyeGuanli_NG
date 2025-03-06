package com.example.WuyeGuanli.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.WuyeGuanli.vo.BasicRes;
import com.example.WuyeGuanli.vo.DeleteinformationReq;
import com.example.WuyeGuanli.vo.UpdateReq;
import com.example.WuyeGuanli.vo.VisitorAddReq;
import com.example.WuyeGuanli.vo.VisitorleaveReq;
import com.example.WuyeGuanli.vo.addinfoReq;
import com.example.WuyeGuanli.service.ifs.ResidentInformationService;
import com.example.WuyeGuanli.service.ifs.VisitorRecordsService;

import jakarta.validation.Valid;


@CrossOrigin
@RestController
//@RequestMapping("/api/residents")
public class VisitorRecordsAndResident_InformationControllors 
{
	
	@Autowired 
	ResidentInformationService residentInformationService;
	@Autowired
	VisitorRecordsService visitorRecordsService;
	@PostMapping(value = "/api/residents/Add")
	public BasicRes create(@Valid @RequestBody addinfoReq req) 
	{
		//return quizService.create(req);
		return residentInformationService.addinfo(req);
	}
	
	@GetMapping(value = "/api/residents/getAll")
	public BasicRes selectAll()
	{
		return residentInformationService.selectAll();
	}
	
	@PostMapping(value = "/api/residents/SearchName")
	public BasicRes searchName(@RequestBody String owerName) 
	{
		//return quizService.create(req);
		return residentInformationService.searchName(owerName);
	}
	
	@DeleteMapping(value = "/api/residents/delete")
	public BasicRes delete(@Valid @RequestBody DeleteinformationReq req) 
	{
		return residentInformationService.deleteinformation(req);
	}
	
	@PutMapping(value = "/api/residents/update")
	public BasicRes updelete(@Valid @RequestBody UpdateReq req) 
	{
		return residentInformationService.updateinformation(req);
	}
	
	@PostMapping(value = "/api/visitors/Add")
	public BasicRes visitorAdd(@Valid @RequestBody VisitorAddReq req) 
	{
		return visitorRecordsService.addinfo(req);
	}
	@PutMapping(value = "/api/visitors/leave")
	public BasicRes visitorleave(@Valid @RequestBody VisitorleaveReq req) 
	{
		return visitorRecordsService.leave(req);
	}
	@GetMapping(value = "/api/visitors/getAll")
	public BasicRes gatAll()
	{
		return visitorRecordsService.getAll();
	}
	
	
}
