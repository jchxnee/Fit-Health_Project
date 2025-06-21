package com.fithealth.backend.dto.Comment;

import com.fithealth.backend.entity.Board;
import com.fithealth.backend.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class CommentCreateDto {

    @Getter
    @AllArgsConstructor
    public static class Create{
        private String comment_content;
        private Long board_no;
        private String user_email;

        public Comment toEntity() {
            return Comment.builder()
                    .commentContent(this.comment_content)
                    .build();
        }
    }
}
