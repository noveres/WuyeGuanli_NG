package com.example.WuyeGuanli.service.ifs;

import com.example.WuyeGuanli.vo.BasicRes;
import com.example.WuyeGuanli.vo.VisitorAddReq;
import com.example.WuyeGuanli.vo.VisitorleaveReq;


public interface VisitorRecordsService 
{
	public BasicRes addinfo(VisitorAddReq req);
	public BasicRes leave  (VisitorleaveReq req);
	public BasicRes getAll();
}
