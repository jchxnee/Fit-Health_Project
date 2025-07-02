package com.fithealth.backend.dto.member;

import com.fithealth.backend.dto.member.LoginDto.Response;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

public class UpdateDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private String phone;
        private String address;
        private CommonEnums.Gender gender;
        private double height;
        private String goal;

        public static UpdateDto.Response toDto(Member member){
            return UpdateDto.Response.builder()
                    .phone(member.getPhone())
                    .address(member.getAddress())
                    .gender(member.getGender())
                    .height(member.getHeight())
                    .goal(member.getGoal())
                    .build();
        }

    }

    @Setter
    @Getter
    public static class RequestInfo {
        private String user_email;
        private String phone;
        private String address;
        private CommonEnums.Gender gender;
        private double height;
        private String goal;
    }
}
