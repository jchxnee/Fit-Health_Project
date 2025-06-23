package com.fithealth.backend.dto.Board;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

public class BoardUpdateDto {

    @Getter
    @AllArgsConstructor
    public static class Update {
        private Long board_no;
        private String board_title;
        private String board_content;
        private String board_category_name;
        private String user_email;
        private List<Long> existing_file_numbers; // 클라이언트가 '유지하겠다'고 보내는 기존 파일의 ID 목록
    }
}