package com.example.wuyeguanli.service;

import com.example.wuyeguanli.dto.LoginRequest;
import com.example.wuyeguanli.dto.LoginResponse;
import com.example.wuyeguanli.entity.Role;
import com.example.wuyeguanli.entity.User;
import com.example.wuyeguanli.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    /**
     * 處理用戶登錄
     * @param loginRequest 包含身份證號和密碼的請求
     * @return 登錄響應，包含用戶信息和令牌
     */
    public LoginResponse login(LoginRequest loginRequest) {
        LoginResponse response = new LoginResponse();

        // 根據身份證號查找用戶
        User user = userRepository.findByIdentityNumber(loginRequest.getIdentityNumber());

        // 如果用戶不存在或密碼不匹配
        if (user == null || !user.getPassword().equals(loginRequest.getPassword())) {
            response.setSuccess(false);
            response.setMessage("帳號或密碼錯誤");
            return response;
        }

        // 檢查用戶角色是否為管理員
        if (user.getRole() != Role.admin) {
            response.setSuccess(false);
            response.setMessage("只有管理員可以登入系統");
            return response;
        }

        // 登錄成功，生成令牌
        String token = generateToken();

        // 設置響應信息
        response.setSuccess(true);
        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setRole(user.getRole());
        response.setToken(token);
        response.setMessage("登錄成功");

        return response;
    }

    /**
     * 生成簡單的令牌
     * 注意：此處生成的令牌僅供測試用，實際應使用更安全的JWT實現
     */
    private String generateToken() {
        return UUID.randomUUID().toString();
    }
}