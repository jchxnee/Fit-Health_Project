package com.fithealth.backend.dto.Mail;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MailRequestDto {
    private String to;
    private String subject;
    private String title;
    private String body;
}
