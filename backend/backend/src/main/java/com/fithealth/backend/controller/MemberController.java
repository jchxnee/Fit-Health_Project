package com.fithealth.backend.controller;

import com.fithealth.backend.dto.member.LoginDto;
import com.fithealth.backend.dto.member.SignupDto;
import com.fithealth.backend.dto.member.UpdateDto;
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
        return ResponseEntity.ok(memberService.createMember(createDto));
    }

    //로그인 API
    @PostMapping("/login")
    public ResponseEntity<LoginDto.Response> loginMember(@RequestBody LoginDto.Request requestDto) {
        System.out.println(requestDto.getUser_email());
        System.out.println(requestDto.getUser_pwd());
        return ResponseEntity.ok(memberService.loginMember(requestDto));
    }

    //중복 이메일 찾기 API
    @GetMapping("/email")
    public ResponseEntity<Boolean> findMember(@RequestParam String userEmail) {
        return ResponseEntity.ok(memberService.findMember(userEmail));
    }

    //이름 수정 API
    @PutMapping("/name")
    public ResponseEntity<Boolean> updateName(@RequestBody UpdateDto.RequestName updateDto) {
        return ResponseEntity.ok(memberService.updateName(updateDto));
    }

    //생일 수정 API
    @PutMapping("/birth")
    public ResponseEntity<Boolean> updateBirth(@RequestBody UpdateDto.RequestBirth updateDto) {
        return ResponseEntity.ok(memberService.updateBirth(updateDto));
    }

    //내 정보 수정 API
    @PutMapping
    public ResponseEntity<Boolean> updateInfo(@RequestBody UpdateDto.RequestInfo updateDto) {
        return ResponseEntity.ok(memberService.updateInfo(updateDto));
    }

    //내 정보 수정 API
    @PutMapping("/pwd")
    public ResponseEntity<Boolean> updatePwd(@RequestBody UpdateDto.RequestPwd updateDto) {
        return ResponseEntity.ok(memberService.updatePwd(updateDto));
    }
}
