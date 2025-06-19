package com.fithealth.backend.service;

import com.fithealth.backend.dto.member.LoginDto;
import com.fithealth.backend.dto.member.SignupDto;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberServiceImpl implements MemberService{

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder;

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
        Member member = memberRepository.findOne(requestDto.getUser_email())
                .orElseThrow(() -> new RuntimeException("이메일이 존재하지 않습니다."));

        // 암호화된 비밀번호와 입력 비밀번호 비교
        if (!passwordEncoder.matches(requestDto.getUser_pwd(), member.getUserPwd())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return LoginDto.Response.toDto(member);
    }

    @Override
    public Boolean findMember(String userEmail) {
        return memberRepository.findOne(userEmail).isPresent();
    }
}
