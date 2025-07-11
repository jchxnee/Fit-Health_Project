package com.fithealth.backend.dto.member;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPwdDto {
    private String userEmail;
    private String newPassword;
}
