package com.fithealth.backend.dto.Board;

import com.fithealth.backend.entity.Board;
import com.fithealth.backend.entity.BoardFile; // BoardFile 임포트
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors; // Collectors 임포트

public class BoardGetDto {

    @Getter
    @AllArgsConstructor
    @Builder
    public static class Response {

        private Long board_no;
        private String board_title;
        private String board_content;
        private LocalDateTime created_date;
        private Long count; // 조회수 (COUNT)
        private Long heart; // 추천수 (HEART)
        private String user_email;
        private String board_category_name;
        private String user_name;

        // ⭐ 첨부 파일 목록을 위한 DTO 추가 ⭐
        private List<BoardFileDto> files; // 게시글 파일 DTO 리스트

        public static Response toDto(Board board) {
            return Response.builder()
                    .board_no(board.getBoardNo())
                    .board_title(board.getBoardTitle())
                    .board_content(board.getBoardContent())
                    .count(board.getCount())
                    .heart(board.getHeart()) // HEART 필드 추가
                    .created_date(board.getCreatedDate())
                    .user_email(board.getMember().getUserEmail())
                    .user_name(board.getMember().getUserName())
                    .board_category_name(board.getBoardCategoryName())
                    .files(board.getBoardPhoto().stream()
                            .map(BoardFileDto::toDto)
                            .collect(Collectors.toList()))
                    .build();
        }

    }



    // ⭐ BoardFile 정보를 담을 내부 DTO 클래스 ⭐
    @Getter
    @AllArgsConstructor
    @Builder
    public static class BoardFileDto {
        private Long file_no; // 파일 번호
        private String origin_name; // 원본 파일명
        private String change_name; // 변경된 파일명 (저장된 실제 파일명)
        // private String file_url; // 프론트에서 접근할 수 있는 파일 URL (필요하다면 추가)

        public static BoardFileDto toDto(BoardFile boardFile) {
            return BoardFileDto.builder()
                    .file_no(boardFile.getBoardFileNo())
                    .origin_name(boardFile.getOriginName())
                    .change_name(boardFile.getChangeName())
                    .build();
        }
    }
}