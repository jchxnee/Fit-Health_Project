package com.fithealth.backend.service;

import com.fithealth.backend.dto.member.LoginDto;
import com.fithealth.backend.dto.member.SignupDto;
import com.fithealth.backend.dto.member.UpdateDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface MemberService {
    String createMember(SignupDto.Create createDto);
    LoginDto.Response loginMember(LoginDto.Request requestDto);
    Boolean findMember(String userEmail);
    String updateProfileImage(String userEmail, MultipartFile file) throws IOException;
    Boolean updateName(UpdateDto.RequestName updateDto);
    Boolean updateBirth(UpdateDto.RequestBirth updateDto);
    Boolean updateInfo(UpdateDto.RequestInfo updateDto);
    Boolean updatePwd(UpdateDto.RequestPwd updateDto);
    Boolean deleteMember(String userEmail);
}
