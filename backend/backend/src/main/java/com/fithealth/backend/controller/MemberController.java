package com.fithealth.backend.controller;

import com.fithealth.backend.auth.JwtTokenProvider;
import com.fithealth.backend.dto.OAuth.AccessTokenDto;
import com.fithealth.backend.dto.OAuth.KakaoProfileDto;
import com.fithealth.backend.dto.OAuth.RedirectDto;
import com.fithealth.backend.dto.member.LoginDto;
import com.fithealth.backend.dto.member.ResponseDto;
import com.fithealth.backend.dto.member.SignupDto;
import com.fithealth.backend.dto.member.UpdateDto;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.SocialType;
import com.fithealth.backend.service.KakaoService;
import com.fithealth.backend.service.MemberService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5175")
@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;
    private final JwtTokenProvider jwtTokenProvider;
    private final KakaoService kakaoService;

    //회원 등록 API
    @PostMapping
    public ResponseEntity<String> addMember(@RequestBody SignupDto.Create createDto) {
        return ResponseEntity.ok(memberService.createMember(createDto));
    }

    //로그인 API
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginMember(@RequestBody LoginDto.Request requestDto) {
        Member member = memberService.loginMember(requestDto);

        String jwtToken = jwtTokenProvider.createToken(member.getUserEmail(), member.getRole().toString());
        Map<String, Object> loginInfo = new HashMap<>();
        loginInfo.put("token", jwtToken);
        return ResponseEntity.ok(loginInfo);
    }

    //중복 이메일 찾기 API
    @GetMapping("/email")
    public ResponseEntity<Boolean> findMember(@RequestParam String userEmail) {
        return ResponseEntity.ok(memberService.findMember(userEmail));
    }

    //아이디(이메일) 찾기 API
    @GetMapping("/id")
    public ResponseEntity<String> findMemberId(@RequestParam String name, @RequestParam String phone) {
        return ResponseEntity.ok(memberService.findId(name,phone));
    }

    //생년월일 찾기 API
    @GetMapping("/birth")
    public ResponseEntity<LocalDate> getMemberBirth() {
        String userEmail = jwtTokenProvider.getUserEmailFromToken();
        return ResponseEntity.ok(memberService.findBirth(userEmail));
    }

    //사진 수정 API
    @PutMapping("/profileImage")
    public ResponseEntity<Boolean> updateProfileImage(@RequestBody Map<String, String> payload) {
        String userEmail = jwtTokenProvider.getUserEmailFromToken();
        String changeName = payload.get("changeName"); // body에서 userName 추출
        return ResponseEntity.ok(memberService.updateProfileImage(userEmail, changeName));
    }

    // 이름 수정 API
    @PutMapping("/name")
    public ResponseEntity<Boolean> updateName(@RequestBody Map<String, String> payload) {
        String userEmail = jwtTokenProvider.getUserEmailFromToken(); // 토큰에서 이메일 추출
        String userName = payload.get("userName"); // body에서 userName 추출
        return ResponseEntity.ok(memberService.updateName(userEmail, userName));
    }

    //생일 수정 API
    @PutMapping("/birth")
    public ResponseEntity<Boolean> updateBirth(@RequestBody Map<String, String> payload) {
        String userEmail = jwtTokenProvider.getUserEmailFromToken();
        String birth = payload.get("birth");
        LocalDate birthDate = LocalDate.parse(birth);
        return ResponseEntity.ok(memberService.updateBirth(userEmail, birthDate));
    }

    //내정보 찾기 API
    @GetMapping("/info")
    public ResponseEntity<LoginDto.Response> getMemberInfo() {
        String userEmail = jwtTokenProvider.getUserEmailFromToken();
        return ResponseEntity.ok(memberService.findInfo(userEmail));
    }

    //내 정보 수정 API
    @PutMapping
    public ResponseEntity<Boolean> updateInfo(@RequestBody UpdateDto.RequestInfo updateDto) {
        String userEmail = jwtTokenProvider.getUserEmailFromToken();
        updateDto.setUser_email(userEmail);
        return ResponseEntity.ok(memberService.updateInfo(updateDto));
    }

    //비밀번호 수정 API
    @PutMapping("/pwd")
    public ResponseEntity<Boolean> updatePwd(@RequestBody Map<String, String> payload) {
        String userEmail = jwtTokenProvider.getUserEmailFromToken();
        String userPwd = payload.get("userPwd");
        return ResponseEntity.ok(memberService.updatePwd(userEmail, userPwd));
    }

    //회원 탈퇴 API
    @PutMapping("/delete")
    public ResponseEntity<Boolean> DeleteMember() {
        String userEmail = jwtTokenProvider.getUserEmailFromToken();
        return ResponseEntity.ok(memberService.deleteMember(userEmail));
    }

    //카카오 로그인 API
    @PostMapping("/kakao/login")
    public ResponseEntity<Map<String, Object>> kakaoLogin(@Valid @RequestBody RedirectDto redirectDto) {
        AccessTokenDto accessTokenDto = kakaoService.getAccessToken(redirectDto.getCode());
        KakaoProfileDto kakaoProfileDto = kakaoService.getKakaoProfile(accessTokenDto.getAccess_token());

        Member originMember = memberService.getMemberBySocialIdAndSocialType(kakaoProfileDto.getId(), SocialType.KAKAO);
        if (originMember == null) {//가입된 기록이 없음 회원가입 해야 함
            originMember = memberService.createOauth(kakaoProfileDto.getId(),
                    kakaoProfileDto.getKakao_account().getEmail(),
                    kakaoProfileDto.getKakao_account().getProfile().getNickname(),
                    SocialType.KAKAO);
        }


        String jwtToken = jwtTokenProvider.createToken(originMember.getUserEmail(), originMember.getRole().toString());
        Map<String, Object> loginInfo = new HashMap<>();
        loginInfo.put("token", jwtToken);
        return new ResponseEntity<>(loginInfo, HttpStatus.OK);
    }


    @GetMapping("/list")
    public ResponseEntity<?> getMemberList() {
        List<ResponseDto> dtos = memberService.findAll();
        return new ResponseEntity<>(dtos, HttpStatus.OK);

    }
}
