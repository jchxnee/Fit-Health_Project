package com.fithealth.backend.dto.member;

import com.fithealth.backend.enums.CommonEnums;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

public class UpdateDto {

    @Getter
    public static class RequestName {
        private String user_email;
        private String user_name;
    }

    @Getter
    public static class RequestBirth {
        private String user_email;
        private LocalDate birth;
    }

    @Getter
    public static class RequestInfo {
        private String user_email;
        private String phone;
        private String address;
        private CommonEnums.Gender gender;
        private double height;
        private String goal;
    }

    @Getter
    public static class RequestPwd {
        private String user_email;
        private String user_pwd;
    }
}
