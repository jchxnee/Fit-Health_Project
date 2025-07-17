package com.fithealth.backend.dto.member;

import com.fithealth.backend.entity.Member;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseDto {

    private String userEmail;
    private String userPwd;
    private String userName;
    private String phone;
    private LocalDateTime enrollDate;

    public static ResponseDto from(Member member) {
        return ResponseDto.builder()
                .userEmail(member.getUserEmail())
                .userPwd(member.getUserPwd())
                .userName(member.getUserName())
                .phone(member.getPhone())
                .enrollDate(member.getEnrollDate())
                .build();
    }
}
