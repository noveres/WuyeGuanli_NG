package com.example.WuyeGuanli.service;

import com.example.WuyeGuanli.entity.DashBoard;
import com.example.WuyeGuanli.repository.DashboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

@Service
public class DashboardService {
    
    private final DashboardRepository dashboardRepository;
    
    @Autowired
    public DashboardService(DashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }
    
    /**
     * 獲取所有公告
     * @return 公告列表
     */
    public List<DashBoard> getAllAnnouncements() {
        return dashboardRepository.findAll();
    }
    
    /**
     * 根據ID獲取公告
     * @param id 公告ID
     * @return 公告對象
     */
    public Optional<DashBoard> getAnnouncementById(Integer id) {
        return dashboardRepository.findById(id);
    }
    
    /**
     * 根據類型獲取公告
     * @param type 公告類型
     * @return 公告列表
     */
    public List<DashBoard> getAnnouncementsByType(String type) {
        return dashboardRepository.findBySort(type);
    }
    
    /**
     * 根據標題關鍵字搜索公告
     * @param keyword 關鍵字
     * @return 公告列表
     */
    public List<DashBoard> searchAnnouncementsByTitle(String keyword) {
        return dashboardRepository.findByHeaderContaining(keyword);
    }
    
    /**
     * 創建新公告
     * @param announcement 公告對象
     * @return 創建後的公告
     */
    public DashBoard createAnnouncement(DashBoard announcement) {
        // 如果日期為空，設置為當前日期
        if (announcement.getDate() == null) {
            announcement.setDate(LocalDate.now());
        }
        
        return dashboardRepository.save(announcement);
    }
    
    /**
     * 更新公告
     * @param id 公告ID
     * @param announcementDetails 更新的公告詳情
     * @return 更新後的公告
     */
    public DashBoard updateAnnouncement(Integer id, DashBoard announcementDetails) {
        Optional<DashBoard> announcement = dashboardRepository.findById(id);
        if (announcement.isPresent()) {
            DashBoard existingAnnouncement = announcement.get();
            
            // 更新各個字段
            if (announcementDetails.getDate() != null) {
                existingAnnouncement.setDate(announcementDetails.getDate());
            }
            
            if (announcementDetails.getSort() != null) {
                existingAnnouncement.setSort(announcementDetails.getSort());
            }
            
            if (announcementDetails.getHeader() != null) {
                existingAnnouncement.setHeader(announcementDetails.getHeader());
            }
            
            if (announcementDetails.getContent() != null) {
                existingAnnouncement.setContent(announcementDetails.getContent());
            }
            
            if (announcementDetails.getImgUrl() != null) {
                existingAnnouncement.setImgUrl(announcementDetails.getImgUrl());
            }
            
            return dashboardRepository.save(existingAnnouncement);
        }
        return null;
    }
    
    /**
     * 刪除公告
     * @param id 公告ID
     * @return 是否成功刪除
     */
    public boolean deleteAnnouncement(Integer id) {
        Optional<DashBoard> announcement = dashboardRepository.findById(id);
        if (announcement.isPresent()) {
            dashboardRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
