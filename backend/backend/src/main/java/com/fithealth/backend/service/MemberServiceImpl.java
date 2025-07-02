package com.fithealth.backend.service;

import com.fithealth.backend.dto.member.LoginDto;
import com.fithealth.backend.dto.member.SignupDto;
import com.fithealth.backend.dto.member.UpdateDto;
import com.fithealth.backend.entity.BoardFile;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.enums.CommonEnums.Grade;
import com.fithealth.backend.enums.SocialType;
import com.fithealth.backend.repository.MemberRepository;
import java.time.LocalDate;
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

        // 암호화된 비밀번호와 입력 비밀번호 비교
        if (!passwordEncoder.matches(requestDto.getUser_pwd(), member.getUserPwd())) {
            return null;
        }

        return member;
    }

    @Override
    public Boolean findMember(String userEmail) {
        return memberRepository.findOneStatusY(userEmail, CommonEnums.Status.Y).isPresent();
    }

    @Override
    public LocalDate findBirth(String userEmail) {
        Member member = memberRepository.findOne(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));
        return member.getBirth();
    }

    @Override
    public String updateProfileImage(String userEmail, MultipartFile file) throws IOException {
        Member member = memberRepository.findOne(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));

        if(file != null && !file.isEmpty()){
            String originName = file.getOriginalFilename();
            String changeName = UUID.randomUUID().toString() + "_" + originName;

            File uploadDir = new File(UPLOAD_PATH);
            if(!uploadDir.exists()){
                uploadDir.mkdirs();
            }

            file.transferTo(new File(UPLOAD_PATH + File.separator + changeName));

            member.changeProfileImage(changeName);
            return changeName;
        }

        return null;
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
    public UpdateDto.Response findInfo(String userEmail) {
        Member member = memberRepository.findOne(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));

        return UpdateDto.Response.toDto(member);
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
    public Member getMemberBySocialId(String socialId) {
        return memberRepository.findBySocialId(socialId).orElse(null);
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
                .build();

        memberRepository.save(member);
        return member;
    }

}
