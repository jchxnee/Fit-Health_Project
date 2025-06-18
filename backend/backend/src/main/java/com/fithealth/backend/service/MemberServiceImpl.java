package com.fithealth.backend.service;

import com.fithealth.backend.dto.Member.SignupDto;
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
}
