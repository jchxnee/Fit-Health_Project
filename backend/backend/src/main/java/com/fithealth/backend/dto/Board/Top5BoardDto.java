package com.fithealth.backend.dto.Board;

import com.fithealth.backend.entity.Board;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class Top5BoardDto {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long board_no;
        private String board_title;
        private String board_content;
        private Long count;
        private Long heart;

        public static Top5BoardDto.Response fromEntity(Board board) {
            return Response.builder()
                    .board_no(board.getBoardNo())
                    .board_title(board.getBoardTitle())
                    .board_content(board.getBoardContent())
                    .count(board.getCount())
                    .heart(board.getHeart())
                    .build();
        }
    }
}
