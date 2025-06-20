package com.fithealth.backend.service;

import com.fithealth.backend.dto.member.LoginDto;
import com.fithealth.backend.dto.member.SignupDto;
import com.fithealth.backend.dto.member.UpdateDto;

public interface MemberService {
    String createMember(SignupDto.Create createDto);
    LoginDto.Response loginMember(LoginDto.Request requestDto);
    Boolean findMember(String userEmail);
    Boolean updateName(UpdateDto.RequestName updateDto);
    Boolean updateBirth(UpdateDto.RequestBirth updateDto);
    Boolean updateInfo(UpdateDto.RequestInfo updateDto);
    Boolean updatePwd(UpdateDto.RequestPwd updateDto);
}
