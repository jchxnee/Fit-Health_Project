package com.fithealth.backend.dto.Notice;
import com.fithealth.backend.entity.Notice;
import lombok.AllArgsConstructor;
import lombok.Getter;

public class NoticeCreateDto {
    @Getter
    @AllArgsConstructor
    public static class Create{
        private String notice_title;
        private String notice_content;
        private String notice_category_name;
        private String user_email;

        public Notice toEntity() {
            return Notice.builder()
                    .noticeTitle(this.notice_title)
                    .noticeContent(this.notice_content)
                    .noticeCategoryName(this.notice_category_name)
                    .build();
        }
    }
}
