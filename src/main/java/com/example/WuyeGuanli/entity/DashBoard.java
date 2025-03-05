package com.example.WuyeGuanli.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "dashboard")
public class DashBoard {
    @Id
    @Column(name = "id")
    private int id;

    @Column(name = "date")
    private LocalDate date;  // 使用 LocalDate 類型

    @Column(name = "sort")
    private String sort;

    @Column(name = "header")
    private String header;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "img_url", length = 500)
    private String imgUrl;
}
