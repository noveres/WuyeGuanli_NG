package com.example.WuyeGuanli.vo;


import com.example.WuyeGuanli.entity.Rule;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RuleSearchRes extends BasicRes{
    List<Rule> ruleList;

    public RuleSearchRes(int statusCode, String message, List<Rule> ruleList) {
        super(statusCode, message);
        this.ruleList = ruleList;
    }
}
