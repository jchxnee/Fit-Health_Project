package com.fithealth.backend.dto.Member;

import com.fithealth.backend.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class SignupDto {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Create{
        private String user_email;
        private String user_pwd;
        private String user_name;
        private LocalDateTime birth;
        private String phone;


        public Member toEntity(){
            return Member.builder()
                    .userEmail(this.user_email)
                    .userPwd(this.user_pwd)
                    .userName(this.user_name)
                    .birth(this.birth)
                    .phone(this.phone)
                    .build();
        }
    }
}
