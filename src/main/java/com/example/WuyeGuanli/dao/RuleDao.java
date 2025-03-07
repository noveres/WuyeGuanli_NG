package com.example.WuyeGuanli.dao;

import com.example.WuyeGuanli.entity.Rule;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RuleDao {
    public List<Rule> getAll();

}
