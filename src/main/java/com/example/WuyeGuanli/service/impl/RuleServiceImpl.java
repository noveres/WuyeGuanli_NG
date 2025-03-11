package com.example.WuyeGuanli.service.impl;

import com.example.WuyeGuanli.dao.RuleDao;
import com.example.WuyeGuanli.entity.Rule;
import com.example.WuyeGuanli.service.ifs.RuleService;
import com.example.WuyeGuanli.vo.RuleSearchRes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class RuleServiceImpl implements RuleService {
    @Autowired
    private RuleDao RuleDao;

    @Override
    public RuleSearchRes getAll() {
        List<Rule> ruleList = RuleDao.getAll();
        return new RuleSearchRes(200, "success", ruleList);
    }
}
