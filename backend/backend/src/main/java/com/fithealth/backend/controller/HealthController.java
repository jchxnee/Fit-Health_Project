package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Health.HealthCreateDto;
import com.fithealth.backend.service.HealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/healths")
@RequiredArgsConstructor
public class HealthController {
    private final HealthService healthService;

    //건강 정보 저장
    @PostMapping
    public ResponseEntity<Long> addHealth(@RequestBody HealthCreateDto.Create createDto) {
        return ResponseEntity.ok(healthService.createHealth(createDto));
    }

    //건강 정보 조회
    @GetMapping
    public ResponseEntity<List<HealthCreateDto.Response>> findHealth(@RequestParam String userEmail) {
        return ResponseEntity.ok(healthService.findHealth(userEmail));
    }

    //건강 정보 조회(날짜만)
    @GetMapping("/date")
    public ResponseEntity<LocalDateTime> findHealthDate(@RequestParam String userEmail) {
        return ResponseEntity.ok(healthService.findHealthDate(userEmail));
    }
}
