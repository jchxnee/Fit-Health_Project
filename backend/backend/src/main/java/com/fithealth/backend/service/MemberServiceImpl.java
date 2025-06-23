package com.fithealth.backend.service;

import com.fithealth.backend.dto.member.LoginDto;
import com.fithealth.backend.dto.member.SignupDto;
import com.fithealth.backend.dto.member.UpdateDto;
import com.fithealth.backend.entity.BoardFile;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.repository.MemberRepository;
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
    public LoginDto.Response loginMember(LoginDto.Request requestDto) {
        Member member = memberRepository.findOneStatusY(requestDto.getUser_email(), CommonEnums.Status.Y)
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));

        // 암호화된 비밀번호와 입력 비밀번호 비교
        if (!passwordEncoder.matches(requestDto.getUser_pwd(), member.getUserPwd())) {
            return null;
        }

        return LoginDto.Response.toDto(member);
    }

    @Override
    public Boolean findMember(String userEmail) {
        return memberRepository.findOneStatusY(userEmail, CommonEnums.Status.Y).isPresent();
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
    public Boolean updateName(UpdateDto.RequestName updateDto) {
        Member member = memberRepository.findOne(updateDto.getUser_email())
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));

        member.changeName(updateDto.getUser_name());
        return true;
    }

    @Override
    public Boolean updateBirth(UpdateDto.RequestBirth updateDto) {
        Member member = memberRepository.findOne(updateDto.getUser_email())
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));

        member.changeBirth(updateDto.getBirth());
        return true;
    }

    @Override
    public Boolean updateInfo(UpdateDto.RequestInfo updateDto) {
        Member member = memberRepository.findOne(updateDto.getUser_email())
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));

        member.changeInfo(updateDto.getPhone(), updateDto.getAddress(), updateDto.getGender(), updateDto.getHeight(), updateDto.getGoal());
        return true;
    }

    @Override
    public Boolean updatePwd(UpdateDto.RequestPwd updateDto) {
        Member member = memberRepository.findOne(updateDto.getUser_email())
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));

        String encodedPassword = passwordEncoder.encode(updateDto.getUser_pwd());

        member.changePwd(encodedPassword);
        return true;
    }

    @Override
    public Boolean deleteMember(String userEmail) {
        Member member = memberRepository.findOne(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));

        member.changeStatus(CommonEnums.Status.N);
        return true;
    }

}
