package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Member.SignupDto;
import com.fithealth.backend.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
