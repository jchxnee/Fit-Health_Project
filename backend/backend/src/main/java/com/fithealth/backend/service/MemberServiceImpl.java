package com.fithealth.backend.service;

import com.fithealth.backend.dto.member.LoginDto;
import com.fithealth.backend.dto.member.SignupDto;
import com.fithealth.backend.dto.member.UpdateDto;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.enums.CommonEnums.Grade;
import com.fithealth.backend.enums.Role;
import com.fithealth.backend.enums.SocialType;
import com.fithealth.backend.repository.MemberRepository;
import java.time.LocalDate;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberServiceImpl implements MemberService{

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    private final String UPLOAD_PATH = "C:\\testImage";

    @Override
    public String createMember(SignupDto.Create createDto) {
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(createDto.getUser_pwd());
        createDto.setUser_pwd(encodedPassword);

        Member member = createDto.toEntity();

        memberRepository.save(member);
        return member.getUserEmail();
    }

    @Override
    public Member loginMember(LoginDto.Request requestDto) {
        Member member = memberRepository.findOneStatusY(requestDto.getUser_email(), CommonEnums.Status.Y)
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));

        if (!passwordEncoder.matches(requestDto.getUser_pwd(), member.getUserPwd())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return member; // 로그인 성공
    }

    @Override
    public Boolean findMember(String userEmail) {
        return memberRepository.findOneStatusY(userEmail, CommonEnums.Status.Y).isPresent();
    }

    @Override
    public String findId(String name, String phone) {
        Member member = memberRepository.findByNameAndPhone(name, phone)
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));
        return member.getUserEmail();
    }

    @Override
    public LocalDate findBirth(String userEmail) {
        Member member = memberRepository.findOne(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));
        return member.getBirth();
    }

    @Override
    public Boolean updateProfileImage(String userEmail, String changeName) {
        Member member = memberRepository.findOne(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));
        member.changeProfileImage(changeName);
        return true;
    }

    @Override
    public Boolean updateName(String userEmail, String userName) {
        Member member = memberRepository.findOne(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));

        member.changeName(userName);
        return true;
    }

    @Override
    public Boolean updateBirth(String userEmail, LocalDate birth) {
        Member member = memberRepository.findOne(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));

        member.changeBirth(birth);
        return true;
    }

    @Override
    public LoginDto.Response findInfo(String userEmail) {
        Member member = memberRepository.findOne(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));

        return LoginDto.Response.toDto(member);
    }

    @Override
    public Boolean updateInfo(UpdateDto.RequestInfo updateDto) {
        Member member = memberRepository.findOne(updateDto.getUser_email())
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));

        member.changeInfo(updateDto.getPhone(), updateDto.getAddress(), updateDto.getGender(), updateDto.getHeight(), updateDto.getGoal());
        return true;
    }

    @Override
    public Boolean updatePwd(String userEmail, String userPwd) {
        Member member = memberRepository.findOne(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));

        String encodedPassword = passwordEncoder.encode(userPwd);

        member.changePwd(encodedPassword);
        return true;
    }

    @Override
    public Boolean deleteMember(String userEmail) {
        Member member = memberRepository.findOne(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));

        member.changeStatus(CommonEnums.Status.N);
        member.changeGrade(CommonEnums.Grade.U);
        return true;
    }

    @Override
    public Member getMemberBySocialIdAndSocialType(String socialId, SocialType socialType) {
        return memberRepository.findBySocialIdAndSocialType(socialId, socialType).orElse(null);
    }

    @Override
    public Member createOauth(String socialId, String email, String name, SocialType socialType) {
        Member member = Member.builder()
                .userEmail(email)
                .userName(name)
                .userPwd("")
                .socialId(socialId)
                .socialType(socialType)
                .grade(Grade.U)
                .role(Role.USER)
                .build();

        memberRepository.save(member);
        return member;
    }

    @Override
    public boolean existsUser(String userName, String userEmail) {
        return memberRepository.findByNameAndEmail(userName, userEmail);
    }

    @Override
    public boolean isSocialMember(String userEmail) {
        SocialType socialType = memberRepository.isSocialMember(userEmail);
        return socialType != null;
    }

    @Override
    public void resetPassword(String userEmail, String newPassword) {

        Optional<Member> existsUser = memberRepository.findByUserEmail(userEmail);

        if (existsUser.isEmpty()) {
            throw new IllegalArgumentException("사용자 정보를 찾을 수 없습니다.");
        }
        Member member = existsUser.get();

        if (member.getSocialType() != null) {

            throw new IllegalArgumentException("소셜 로그인 회원은 비밀번호를 재설정할 수 없습니다.");
        }

        String encodedPassword = passwordEncoder.encode(newPassword);

        member.updatePwd(encodedPassword);
        memberRepository.save(member);
    }
    }

