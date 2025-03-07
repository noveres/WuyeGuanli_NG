package com.example.WuyeGuanli.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 允許所有路徑
                .allowedOrigins("http://localhost:4200")  // 允許前端的域名
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // 允許的 HTTP 方法
                .allowedHeaders("*")  // 允許所有請求頭
                .allowCredentials(true)  // 允許攜帶認證信息
                .maxAge(3600);  // 預檢請求的有效期
    }
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置靜態資源訪問
        registry.addResourceHandler("/resources/**")
                .addResourceLocations("classpath:/");
        registry.addResourceHandler("/avatars/**")
                .addResourceLocations("classpath:/static/avatars/");
    }
}
