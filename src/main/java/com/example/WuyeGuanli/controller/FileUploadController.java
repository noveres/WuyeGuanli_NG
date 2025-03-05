package com.example.WuyeGuanli.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class FileUploadController {

    // 圖片存儲路徑
    private final Path fileStoragePath;
    private final String fileStorageLocation;

    // 構造函數，初始化存儲路徑
    public FileUploadController() {
        this.fileStorageLocation = "src/main/resources/img/DashBoard";
        this.fileStoragePath = Paths.get(this.fileStorageLocation).toAbsolutePath().normalize();

        try {
            // 確保目錄存在，如果不存在則創建
            Files.createDirectories(this.fileStoragePath);
        } catch (IOException ex) {
            throw new RuntimeException("無法創建圖片存儲目錄", ex);
        }
    }

    /**
     * 上傳圖片
     * @param file 上傳的文件
     * @return 包含文件名的響應
     */
    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
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

            // 返回文件名
            Map<String, String> response = new HashMap<>();
            response.put("fileName", fileName);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IOException ex) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "文件上傳失敗: " + ex.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 獲取圖片
     * @param fileName 文件名
     * @return 圖片資源
     */
    @GetMapping("/images/{fileName:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) {
        try {
            Path filePath = this.fileStoragePath.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG) // 可以根據實際文件類型設置
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 刪除圖片
     * @param fileName 文件名
     * @return 操作結果
     */
    @DeleteMapping("/images/{fileName:.+}")
    public ResponseEntity<Map<String, String>> deleteImage(@PathVariable String fileName) {
        try {
            Path filePath = this.fileStoragePath.resolve(fileName).normalize();
            boolean deleted = Files.deleteIfExists(filePath);

            Map<String, String> response = new HashMap<>();
            if (deleted) {
                response.put("message", "文件刪除成功");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                response.put("error", "文件不存在");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (IOException ex) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "文件刪除失敗: " + ex.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
