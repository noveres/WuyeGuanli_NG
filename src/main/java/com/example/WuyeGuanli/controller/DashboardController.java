package com.example.WuyeGuanli.controller;

import com.example.WuyeGuanli.entity.DashBoard;
import com.example.WuyeGuanli.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true") // 使用與全局配置相同的設置
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }
    
    /**
     * 獲取所有公告
     * @return 公告列表
     */
    @GetMapping
    public ResponseEntity<List<DashBoard>> getAllAnnouncements() {
        List<DashBoard> announcements = dashboardService.getAllAnnouncements();
        return new ResponseEntity<>(announcements, HttpStatus.OK);
    }
    
    /**
     * 根據ID獲取公告
     * @param id 公告ID
     * @return 公告對象
     */
    @GetMapping("/{id}")
    public ResponseEntity<DashBoard> getAnnouncementById(@PathVariable Integer id) {
        Optional<DashBoard> announcement = dashboardService.getAnnouncementById(id);
        return announcement.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    /**
     * 搜索公告
     * @param type 公告類型
     * @param keyword 關鍵字
     * @return 公告列表
     */
    @GetMapping("/search")
    public ResponseEntity<List<DashBoard>> searchAnnouncements(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String keyword) {
        
        List<DashBoard> announcements;
        
        if (type != null && !type.isEmpty()) {
            announcements = dashboardService.getAnnouncementsByType(type);
        } else if (keyword != null && !keyword.isEmpty()) {
            announcements = dashboardService.searchAnnouncementsByTitle(keyword);
        } else {
            announcements = dashboardService.getAllAnnouncements();
        }
        
        return new ResponseEntity<>(announcements, HttpStatus.OK);
    }
    
    /**
     * 創建新公告
     * @param announcementData 公告數據
     * @return 創建後的公告
     */
    @PostMapping
    public ResponseEntity<DashBoard> createAnnouncement(@RequestBody Map<String, Object> announcementData) {
        try {
            DashBoard announcement = new DashBoard();
            
            // 設置日期
            if (announcementData.containsKey("date") && announcementData.get("date") != null) {
                String dateStr = (String) announcementData.get("date");
                try {
                    LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_DATE);
                    announcement.setDate(date);
                } catch (DateTimeParseException e) {
                    // 如果日期格式不正確，設置為當前日期
                    announcement.setDate(LocalDate.now());
                }
            } else {
                announcement.setDate(LocalDate.now());
            }
            
            // 設置其他字段
            if (announcementData.containsKey("sort")) {
                announcement.setSort((String) announcementData.get("sort"));
            }
            
            if (announcementData.containsKey("header")) {
                announcement.setHeader((String) announcementData.get("header"));
            }
            
            if (announcementData.containsKey("content")) {
                announcement.setContent((String) announcementData.get("content"));
            }
            
            if (announcementData.containsKey("imgUrl")) {
                announcement.setImgUrl((String) announcementData.get("imgUrl"));
            }
            
            DashBoard createdAnnouncement = dashboardService.createAnnouncement(announcement);
            return new ResponseEntity<>(createdAnnouncement, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * 更新公告
     * @param id 公告ID
     * @param announcementData 更新的公告數據
     * @return 更新後的公告
     */
    @PutMapping("/{id}")
    public ResponseEntity<DashBoard> updateAnnouncement(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> announcementData) {
        try {
            DashBoard announcement = new DashBoard();
            
            // 設置日期
            if (announcementData.containsKey("date") && announcementData.get("date") != null) {
                String dateStr = (String) announcementData.get("date");
                try {
                    LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_DATE);
                    announcement.setDate(date);
                } catch (DateTimeParseException e) {
                    // 如果日期格式不正確，不更新日期字段
                }
            }
            
            // 設置其他字段
            if (announcementData.containsKey("sort")) {
                announcement.setSort((String) announcementData.get("sort"));
            }
            
            if (announcementData.containsKey("header")) {
                announcement.setHeader((String) announcementData.get("header"));
            }
            
            if (announcementData.containsKey("content")) {
                announcement.setContent((String) announcementData.get("content"));
            }
            
            if (announcementData.containsKey("imgUrl")) {
                announcement.setImgUrl((String) announcementData.get("imgUrl"));
            }
            
            DashBoard updatedAnnouncement = dashboardService.updateAnnouncement(id, announcement);
            if (updatedAnnouncement != null) {
                return new ResponseEntity<>(updatedAnnouncement, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * 刪除公告
     * @param id 公告ID
     * @return 操作結果
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Integer id) {
        boolean deleted = dashboardService.deleteAnnouncement(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
