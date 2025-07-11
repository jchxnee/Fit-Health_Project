package com.fithealth.backend.dto.Board;

import com.fithealth.backend.entity.Board;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor; // 기본 생성자 추가
import lombok.Setter; // Setter 추가 (ModelAttribute 바인딩을 위해)

import java.util.List;

public class BoardCreateDto {

    @Getter
    @Setter // @ModelAttribute가 제대로 바인딩하려면 Setter가 필요합니다.
    @NoArgsConstructor // @ModelAttribute 바인딩을 위해 기본 생성자도 필요합니다.
    @AllArgsConstructor
    public static class Create{
        private String board_title;
        private String board_content;
        private String board_category_name;
        private String user_email;
        private List<String> new_file_names;

        public Board toEntity() {
            return Board.builder()
                    .boardTitle(this.board_title)
                    .boardContent(this.board_content)
                    .boardCategoryName(this.board_category_name)
                    .build();
        }
    }
}