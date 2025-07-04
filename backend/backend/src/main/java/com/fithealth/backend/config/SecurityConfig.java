package com.fithealth.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer; // 이 임포트가 필요할 수 있습니다.

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Security 필터 체인 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 비활성화 (보통 REST API에서 토큰 기반 인증 시 사용)
                .csrf(AbstractHttpConfigurer::disable) // 또는 .csrf(csrf -> csrf.disable())

                // 모든 요청에 대해 인증 없이 허용
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())

                // ★★★ 이 부분을 추가해야 합니다! 이 부분이 없으면 CORS 설정이 활성화되지 않습니다. ★★★
                // CORS 설정을 활성화하고, 위에서 정의한 corsConfigurationSource 빈을 사용하도록 지시합니다.
                .cors(cors -> cors.configurationSource(corsConfigurationSource())); // 이 줄을 추가하세요.

        return http.build();
    }

    // 전역 CORS 설정 빈 등록 (Spring Security가 자동으로 사용)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // 자격 증명 (쿠키, 인증 헤더 등) 허용
        config.setMaxAge(3600L); // Preflight 요청 결과 캐싱 시간 (1시간)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }


}
