package com.fithealth.backend.dto.Board;

import com.fithealth.backend.entity.Board;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class BoardCreateDto {

    @Getter
    @AllArgsConstructor
    public static class Create{
        private String board_title;
        private String board_content;
        private String user_id;
        private MultipartFile file;
        private List<String> tags;

        public Board toEntity() {
            return Board.builder()
                    .boardTitle(this.board_title)
                    .boardContent(this.board_content)
                    .build();
        }
    }
}
