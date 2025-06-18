package com.fithealth.backend.service;

import com.fithealth.backend.dto.member.LoginDto;
import com.fithealth.backend.dto.member.SignupDto;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberServiceImpl implements MemberService{

    private final MemberRepository memberRepository;

    @Override
    public String createMember(SignupDto.Create createDto) {
        Member member = createDto.toEntity();
        memberRepository.save(member);
        return member.getUserEmail();
    }

    @Override
    public LoginDto.Response findMember(LoginDto.Request requestDto) {
        Member member = memberRepository.findOne(requestDto.getUser_email())
                .orElseThrow(() -> new RuntimeException("이메일이 존재하지 않습니다."));

        if(!member.getUserPwd().equals(requestDto.getUser_pwd())){
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        return LoginDto.Response.toDto(member);
    }
}
