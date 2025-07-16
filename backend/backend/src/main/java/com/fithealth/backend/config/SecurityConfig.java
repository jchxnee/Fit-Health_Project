package com.fithealth.backend.config;

import com.fithealth.backend.auth.JwtTokenFilter;
import com.fithealth.backend.service.GoogleOauth2LoginSuccess;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer; // 이 임포트가 필요할 수 있습니다.

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtTokenFilter jwtTokenFilter;
    private final GoogleOauth2LoginSuccess googleOauth2LoginSuccess;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Security 필터 체인 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable) //CSRF 보안기능 비활성 -> 세션을 통한 공격(REST에서는 필요없음)
                .httpBasic(AbstractHttpConfigurer::disable) //HTTP Basic인증 비활성(아이디와 비밀번호를 HTTP요청 헤더에 담아서 인증하는 방식)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/members/login",
                                "/api/members",
                                "/api/members/email",
                                "/api/members/id",
                                "/mail/send",
                                "/mail/check",
                                "/api/members/exists",
                                "/api/members/resetPwd",
                                "/api/chatbot/*",
                                "/api/trainer/top3",
                                "/api/board/top5",
                                "/api/review/top6",
                                "/oauth2/*",
                                "/api/trainer",
                                "/api/board/all",
                                "/api/notice/all"
                        ).permitAll()
                        .anyRequest().authenticated() // 위의 요청경로를 제외한 나머지 경로는 인증
                )
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                //OAuth2 로그인 성공시 실행될 핸들러를 설정
                .oauth2Login(o -> o.successHandler(googleOauth2LoginSuccess))
                .build();
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
