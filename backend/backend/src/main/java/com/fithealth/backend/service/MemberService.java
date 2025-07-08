package com.fithealth.backend.service;

import com.fithealth.backend.dto.member.LoginDto;
import com.fithealth.backend.dto.member.SignupDto;
import com.fithealth.backend.dto.member.UpdateDto;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.SocialType;
import java.time.LocalDate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface MemberService {
    String createMember(SignupDto.Create createDto);
    Member loginMember(LoginDto.Request requestDto);
    Boolean findMember(String userEmail);
    LocalDate findBirth(String userEmail);
    String updateProfileImage(String userEmail, MultipartFile file) throws IOException;
    Boolean updateName(String userEmail, String userName);
    Boolean updateBirth(String userEmail, LocalDate birth);
    LoginDto.Response findInfo(String userEmail);
    Boolean updateInfo(UpdateDto.RequestInfo updateDto);
    Boolean updatePwd(String userEmail, String userPwd);
    Boolean deleteMember(String userEmail);
    Member getMemberBySocialIdAndSocialType(String socialId, SocialType socialType);
    Member createOauth(String socialId, String email, String name, SocialType socialType);
}
