package com.example.WuyeGuanli.controller;

import com.example.WuyeGuanli.entity.User;
import com.example.WuyeGuanli.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

/**
 * UserController 負責定義用戶相關的 API 端點，
 * 包括創建、查詢、更新、刪除以及查詢房東對應房客等操作。
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    // 注入 UserService 處理業務邏輯
    @Autowired
    private UserService userService;

    /**
     * 建立新用戶
     * 請求範例：POST /api/users
     */
    @PostMapping
    public User createUser(@RequestBody User user) {
        // 此處可加入權限驗證，如檢查是否為管理員或房東
        return userService.createUser(user);
    }

    /**
     * 根據用戶 ID 查詢用戶資料
     * 請求範例：GET /api/users/{id}
     */
    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    /**
     * 查詢所有用戶資料（通常僅限管理員使用）
     * 請求範例：GET /api/users
     */
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    /**
     * 更新用戶資料
     * 請求範例：PUT /api/users/{id}
     */
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> userOpt = userService.getUserById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // 根據需求更新各欄位，實際情況可能需要更嚴格的權限驗證
            user.setName(updatedUser.getName());
            user.setIdentityNumber(updatedUser.getIdentityNumber());
            user.setPassword(updatedUser.getPassword());
            user.setRole(updatedUser.getRole());
            // 如果是房客，也可設定對應的房東
            user.setLandlord(updatedUser.getLandlord());
            return userService.updateUser(user);
        }
        return null;
    }

    /**
     * 刪除用戶
     * 請求範例：DELETE /api/users/{id}
     */
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    /**
     * 根據房東的 ID 查詢其所有房客
     * 請求範例：GET /api/users/landlord/{landlordId}/tenants
     */
    @GetMapping("/landlord/{landlordId}/tenants")
    public List<User> getTenantsByLandlord(@PathVariable Long landlordId) {
        return userService.getTenantsByLandlordId(landlordId);
    }
}
