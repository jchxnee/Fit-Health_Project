package com.fithealth.backend.controller;

import com.fithealth.backend.dto.member.LoginDto;
import com.fithealth.backend.dto.member.SignupDto;
import com.fithealth.backend.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    //회원 등록 API
    @PostMapping
    public ResponseEntity<String> addMember(@RequestBody SignupDto.Create createDto) {
        String userEmail = memberService.createMember(createDto);
        return ResponseEntity.ok(userEmail);
    }

    //회원 조회 API
    @PostMapping("/login")
    public ResponseEntity<LoginDto.Response> login(@RequestBody LoginDto.Request requestDto) {
        return ResponseEntity.ok(memberService.findMember(requestDto));
    }
}
