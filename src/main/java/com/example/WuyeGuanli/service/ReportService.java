package com.example.WuyeGuanli.service;

import com.example.WuyeGuanli.entity.Report;
import com.example.WuyeGuanli.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    @Autowired
    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    /**
     * 獲取所有維修申請
     * @return 維修申請列表
     */
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    /**
     * 根據ID獲取維修申請
     * @param id 維修申請ID
     * @return 維修申請
     */
    public Optional<Report> getReportById(Integer id) {
        return reportRepository.findById(id);
    }

    /**
     * 根據類型獲取維修申請
     * @param sort 維修類型
     * @return 維修申請列表
     */
    public List<Report> getReportsByType(String sort) {
        return reportRepository.findBySort(sort);
    }

    /**
     * 根據狀態獲取維修申請
     * @param isRepaired 是否已維修
     * @return 維修申請列表
     */
    public List<Report> getReportsByStatus(Integer isRepaired) {
        return reportRepository.findByIsRepaired(isRepaired);
    }

    /**
     * 搜索維修申請
     * @param keyword 關鍵字
     * @return 維修申請列表
     */
    public List<Report> searchReports(String keyword) {
        return reportRepository.findByDescriptionContainingOrLocationContaining(keyword, keyword);
    }

    /**
     * 根據類型和狀態獲取維修申請
     * @param sort 維修類型
     * @param isRepaired 是否已維修
     * @return 維修申請列表
     */
    public List<Report> getReportsByTypeAndStatus(String sort, Integer isRepaired) {
        return reportRepository.findBySortAndIsRepaired(sort, isRepaired);
    }

    /**
     * 創建新的維修申請
     * @param report 維修申請
     * @return 創建後的維修申請
     */
    @Transactional
    public Report createReport(Report report) {
        if (report.getCreateTime() == null) {
            report.setCreateTime(LocalDateTime.now());
        }
        if (report.getIsRepaired() == null) {
            report.setIsRepaired(0);
        }
        if (report.getStatus() == null) {
            report.setStatus("待處理");
        }
        return reportRepository.save(report);
    }

    /**
     * 更新維修申請
     * @param id 維修申請ID
     * @param reportDetails 更新的維修申請詳情
     * @return 更新後的維修申請
     */
    @Transactional
    public Report updateReport(Integer id, Report reportDetails) {
        return reportRepository.findById(id)
                .map(existingReport -> {
                    // 只更新非空字段
                    if (reportDetails.getSort() != null) {
                        existingReport.setSort(reportDetails.getSort());
                    }
                    if (reportDetails.getLocation() != null) {
                        existingReport.setLocation(reportDetails.getLocation());
                    }
                    if (reportDetails.getDescription() != null) {
                        existingReport.setDescription(reportDetails.getDescription());
                    }
                    if (reportDetails.getPhoto1() != null) {
                        existingReport.setPhoto1(reportDetails.getPhoto1());
                    }
                    if (reportDetails.getPhoto2() != null) {
                        existingReport.setPhoto2(reportDetails.getPhoto2());
                    }
                    if (reportDetails.getIsRepaired() != null) {
                        existingReport.setIsRepaired(reportDetails.getIsRepaired());
                        // 如果更新為已完成狀態，設置處理時間
                        if (reportDetails.getIsRepaired() == 1 && existingReport.getProcessTime() == null) {
                            existingReport.setProcessTime(LocalDateTime.now());
                        }
                    }
                    if (reportDetails.getStatus() != null) {
                        existingReport.setStatus(reportDetails.getStatus());
                    }
                    if (reportDetails.getCost() != null) {
                        existingReport.setCost(reportDetails.getCost());
                    }
                    if (reportDetails.getProcessTime() != null) {
                        existingReport.setProcessTime(reportDetails.getProcessTime());
                    }
                    
                    return reportRepository.save(existingReport);
                })
                .orElse(null);
    }

    /**
     * 刪除維修申請
     * @param id 維修申請ID
     * @return 是否刪除成功
     */
    @Transactional
    public boolean deleteReport(Integer id) {
        return reportRepository.findById(id)
                .map(report -> {
                    reportRepository.delete(report);
                    return true;
                })
                .orElse(false);
    }
}
