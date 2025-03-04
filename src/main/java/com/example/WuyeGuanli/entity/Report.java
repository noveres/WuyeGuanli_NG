package com.example.WuyeGuanli.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "report")
public class Report {
    @Id
    @Column(name = "id")
    private int id;

    @Column(name = "sort")
    private String sort;

    @Column(name = "where")
    private String location;

    @Column(name = "description")
    private String description;

    @Column(name = "photo1")
    private String photo1;

    @Column(name = "photo2")
    private String photo2;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "process_time")
    private LocalDateTime processTime;

    @Column(name = "is_repaired")
    private Boolean isRepaired;

    @Column(name = "cost")
    private int cost ;

}
