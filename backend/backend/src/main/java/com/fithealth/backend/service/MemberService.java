package com.fithealth.backend.service;

import com.fithealth.backend.dto.Member.SignupDto;

public interface MemberService {
    String createMember(SignupDto.Create createDto);
}
