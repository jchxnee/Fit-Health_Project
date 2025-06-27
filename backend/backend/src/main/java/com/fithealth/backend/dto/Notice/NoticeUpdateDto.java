package com.fithealth.backend.dto.Notice;
import lombok.AllArgsConstructor;
import lombok.Getter;


public class NoticeUpdateDto {
    @Getter
    @AllArgsConstructor
    public static class Update{
        private Long notice_no;
        private String notice_title;
        private String notice_content;
        private String notice_category_name;
        private String user_email;

    }
}
