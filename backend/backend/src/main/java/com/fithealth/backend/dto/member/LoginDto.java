package com.fithealth.backend.dto.member;

import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LoginDto {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Find {
        private String user_email;

        public static Find toDto(Member member){
            return Find.builder()
                    .user_email(member.getUserEmail())
                    .build();
        }
    }

    @Getter
    @Setter
    public static class Request {
        private String user_email;
        private String user_pwd;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private String user_email;
        private Long trainer_no;
        private String user_name;
        private LocalDate birth;
        private String phone;
        private String address;
        private CommonEnums.Gender gender;
        private double height;
        private String goal;
        private String profile_image;
        private CommonEnums.Grade grade;

        public static Response toDto(Member member){
            return Response.builder()
                    .user_email(member.getUserEmail())
                    .trainer_no(
                            member.getTrainer() != null ? member.getTrainer().getTrainerNo() : null
                    )
                    .user_name(member.getUserName())
                    .birth(member.getBirth())
                    .phone(member.getPhone())
                    .address(member.getAddress())
                    .gender(member.getGender())
                    .height(member.getHeight())
                    .goal(member.getGoal())
                    .profile_image(member.getProfileImage())
                    .grade(member.getGrade())
                    .build();
        }

    }
}
