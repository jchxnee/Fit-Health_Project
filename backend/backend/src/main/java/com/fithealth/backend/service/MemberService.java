package com.fithealth.backend.service;

import com.fithealth.backend.dto.member.LoginDto;
import com.fithealth.backend.dto.member.SignupDto;

public interface MemberService {
    String createMember(SignupDto.Create createDto);
    LoginDto.Response findMember(LoginDto.Request requestDto);
}
