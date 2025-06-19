package com.fithealth.backend.dto.Board;

import com.fithealth.backend.entity.Board;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List; // List 임포트

public class BoardCreateDto {

    @Getter
    @AllArgsConstructor
    public static class Create{
        private String board_title;
        private String board_content;
        private String board_category_name;
        private String user_email;
        private List<MultipartFile> files;

        public Board toEntity() {
            return Board.builder()
                    .boardTitle(this.board_title)
                    .boardContent(this.board_content)
                    .boardCategoryName(this.board_category_name)
                    .build();
        }
    }
}