package com.fithealth.backend.dto.Notice;
import com.fithealth.backend.entity.Notice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class NoticeGetDto {
    @Getter
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long notice_no;
        private String notice_title;
        private String notice_content;
        private String notice_category_name;
        private LocalDateTime created_date;
        private String user_email;
        private String user_name;

        // ⭐ userEmail 파라미터 추가 ⭐
        public static NoticeGetDto.Response toDto(Notice notice) {
            return Response.builder()
                    .notice_no(notice.getNoticeNo())
                    .notice_title(notice.getNoticeTitle())
                    .notice_content(notice.getNoticeContent())
                    .notice_category_name(notice.getNoticeCategoryName())
                    .created_date(notice.getCreatedDate())
                    .user_email(notice.getMember().getUserEmail())
                    .user_name(notice.getMember().getUserName())
                    .build();
        }
    }
}
