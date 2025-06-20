package com.fithealth.backend.dto.Comment;

import com.fithealth.backend.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class CommentGetDto {

    @Getter
    @AllArgsConstructor
    @Builder
    public static class Response {

        private Long comment_no;
        private String comment_content;
        private LocalDateTime created_date;
        private String user_email;
        private String user_name;
        private String user_img;

        public static CommentGetDto.Response toDto(Comment comment) {
            return Response.builder()
                    .comment_no(comment.getCommentNo())
                    .comment_content(comment.getCommentContent())
                    .created_date(comment.getCreatedDate())
                    .user_email(comment.getMember().getUserEmail())
                    .user_name(comment.getMember().getUserName())
                    .user_img(comment.getMember().getProfileImage())
                    .build();
        }
    }
}
