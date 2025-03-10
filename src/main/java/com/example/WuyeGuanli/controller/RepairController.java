package com.example.WuyeGuanli.controller;

import com.example.WuyeGuanli.entity.Report;
import com.example.WuyeGuanli.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/repairs")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class RepairController {
    
    private final ReportService reportService;
    private final Path fileStoragePath;
    
    @Autowired
    public RepairController(ReportService reportService) {
        this.reportService = reportService;
        
        // 創建維修圖片存儲目錄
        String fileStorageLocation = "src/main/resources/img/WS";
        this.fileStoragePath = Paths.get(fileStorageLocation).toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.fileStoragePath);
        } catch (IOException ex) {
            throw new RuntimeException("無法創建維修圖片存儲目錄", ex);
        }
    }
    
    /**
     * 獲取所有維修申請
     * @return 維修申請列表
     */
    @GetMapping
    public ResponseEntity<List<Report>> getAllRepairs() {
        List<Report> reports = reportService.getAllReports();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }
    
    /**
     * 根據ID獲取維修申請
     * @param id 維修申請ID
     * @return 維修申請
     */
    @GetMapping("/{id}")
    public ResponseEntity<Report> getRepairById(@PathVariable Integer id) {
        Optional<Report> report = reportService.getReportById(id);
        return report.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    /**
     * 搜索維修申請
     * @param sort 維修類型
     * @param status 維修狀態
     * @param keyword 關鍵字
     * @return 維修申請列表
     */
    @GetMapping("/search")
    public ResponseEntity<List<Report>> searchRepairs(
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword) {
        
        List<Report> reports;
        
        if (sort != null && !sort.isEmpty() && status != null && !status.isEmpty()) {
            // 根據類型和狀態查詢
            Integer isRepaired = 0;
            if (status.equals("已完成")) {
                isRepaired = 1;
            }
            reports = reportService.getReportsByTypeAndStatus(sort, isRepaired);
        } else if (sort != null && !sort.isEmpty()) {
            // 根據類型查詢
            reports = reportService.getReportsByType(sort);
        } else if (status != null && !status.isEmpty()) {
            // 根據狀態查詢
            Integer isRepaired = 0;
            if (status.equals("已完成")) {
                isRepaired = 1;
            }
            reports = reportService.getReportsByStatus(isRepaired);
        } else if (keyword != null && !keyword.isEmpty()) {
            // 根據關鍵字查詢
            reports = reportService.searchReports(keyword);
        } else {
            // 獲取所有
            reports = reportService.getAllReports();
        }
        
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }
    
    /**
     * 創建新的維修申請
     * @param reportData 維修申請數據
     * @return 創建後的維修申請
     */
    @PostMapping
    public ResponseEntity<Report> createRepair(@RequestBody Map<String, Object> reportData) {
        try {
            Report report = new Report();
            
            // 設置基本信息
            if (reportData.containsKey("sort")) {
                report.setSort((String) reportData.get("sort"));
            }
            
            if (reportData.containsKey("location")) {
                report.setLocation((String) reportData.get("location"));
            }
            
            if (reportData.containsKey("description")) {
                report.setDescription((String) reportData.get("description"));
            }
            
            // 設置圖片URL
            if (reportData.containsKey("photo1")) {
                report.setPhoto1((String) reportData.get("photo1"));
            }
            
            if (reportData.containsKey("photo2")) {
                report.setPhoto2((String) reportData.get("photo2"));
            }
            
            // 設置創建時間為當前時間
            report.setCreateTime(LocalDateTime.now());
            
            // 設置處理時間
            if (reportData.containsKey("process_time") && reportData.get("process_time") != null) {
                String dateStr = (String) reportData.get("process_time");
                try {
                    LocalDateTime processTime = LocalDateTime.parse(dateStr, DateTimeFormatter.ISO_DATE_TIME);
                    report.setProcessTime(processTime);
                } catch (DateTimeParseException e) {
                    // 如果日期格式不正確，設置為 null
                    report.setProcessTime(null);
                }
            }
            
            // 設置維修狀態
            if (reportData.containsKey("isRepaired")) {
                report.setIsRepaired((Integer) reportData.get("isRepaired"));
            } else {
                report.setIsRepaired(0); // 默認為未維修
            }
            
            // 設置維修費用
            if (reportData.containsKey("cost")) {
                report.setCost((Integer) reportData.get("cost"));
            }
            
            Report savedReport = reportService.createReport(report);
            return new ResponseEntity<>(savedReport, HttpStatus.CREATED);
            
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * 更新維修申請
     * @param id 維修申請ID
     * @param reportData 更新的維修申請數據
     * @return 更新後的維修申請
     */
    @PutMapping("/{id}")
    public ResponseEntity<Report> updateRepair(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> reportData) {
        try {
            Report reportDetails = new Report();
            
            // 設置基本信息
            if (reportData.containsKey("sort")) {
                reportDetails.setSort((String) reportData.get("sort"));
            }
            
            if (reportData.containsKey("location")) {
                reportDetails.setLocation((String) reportData.get("location"));
            }
            
            if (reportData.containsKey("description")) {
                reportDetails.setDescription((String) reportData.get("description"));
            }
            
            // 設置圖片URL
            if (reportData.containsKey("photo1")) {
                reportDetails.setPhoto1((String) reportData.get("photo1"));
            }
            
            if (reportData.containsKey("photo2")) {
                reportDetails.setPhoto2((String) reportData.get("photo2"));
            }
            
            // 設置處理時間
            if (reportData.containsKey("process_time") && reportData.get("process_time") != null) {
                String dateStr = (String) reportData.get("process_time");
                try {
                    LocalDateTime processTime = LocalDateTime.parse(dateStr, DateTimeFormatter.ISO_DATE_TIME);
                    reportDetails.setProcessTime(processTime);
                } catch (DateTimeParseException e) {
                    // 如果日期格式不正確，不更新處理時間
                }
            }
            
            // 設置狀態
            if (reportData.containsKey("status")) {
                String status = (String) reportData.get("status");
                reportDetails.setStatus(status);
                reportDetails.setIsRepaired(status.equals("已完成") ? 1 : 0);
            }
            
            // 設置費用
            if (reportData.containsKey("cost")) {
                if (reportData.get("cost") instanceof Integer) {
                    reportDetails.setCost((Integer) reportData.get("cost"));
                } else if (reportData.get("cost") instanceof String) {
                    try {
                        int cost = Integer.parseInt((String) reportData.get("cost"));
                        reportDetails.setCost(cost);
                    } catch (NumberFormatException e) {
                        // 忽略無效的費用值
                    }
                }
            }
            
            Report updatedReport = reportService.updateReport(id, reportDetails);
            if (updatedReport != null) {
                return new ResponseEntity<>(updatedReport, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * 刪除維修申請
     * @param id 維修申請ID
     * @return 操作結果
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRepair(@PathVariable Integer id) {
        boolean deleted = reportService.deleteReport(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * 上傳維修照片
     * @param file 上傳的文件
     * @return 包含文件URL的響應
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadPhoto(@RequestParam("file") MultipartFile file) {
        // 檢查文件是否為空
        if (file.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "請選擇要上傳的文件");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        
        // 檢查文件類型
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "只允許上傳圖片文件");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        
        try {
            // 生成唯一文件名
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + fileExtension;
            
            // 保存文件
            Path targetLocation = this.fileStoragePath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // 構建並返回URL
            String fileUrl = "/api/img/WS/" + fileName;
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IOException ex) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "文件上傳失敗: " + ex.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
