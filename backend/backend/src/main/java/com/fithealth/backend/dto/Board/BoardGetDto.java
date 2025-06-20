package com.fithealth.backend.dto.Board;

import com.fithealth.backend.entity.Board;
import com.fithealth.backend.entity.BoardFile;
import com.fithealth.backend.dto.Comment.CommentGetDto; // ⭐ CommentGetDto import 추가 ⭐
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class BoardGetDto {

    @Getter
    @AllArgsConstructor
    @Builder
    public static class Response {

        private Long board_no;
        private String board_title;
        private String board_content;
        private LocalDateTime created_date;
        private Long count;
        private Long heart;
        private String user_email;
        private String user_name;
        private String user_img;
        private String board_category_name;
        private Long comments_count;
        private List<BoardFileDto> files;
        private Boolean is_liked_by_user;
        private List<CommentGetDto> comments; // ⭐ 이 줄을 추가하여 댓글 목록 포함 ⭐

        // ⭐ userEmail 파라미터 추가 ⭐
        public static Response toDto(Board board, Boolean isLikedByUser) {
            return Response.builder()
                    .board_no(board.getBoardNo())
                    .board_title(board.getBoardTitle())
                    .board_content(board.getBoardContent())
                    .count(board.getCount())
                    .heart(board.getHeart())
                    .created_date(board.getCreatedDate())
                    .user_email(board.getMember().getUserEmail())
                    .user_name(board.getMember().getUserName())
                    .user_img(board.getMember().getProfileImage())
                    .board_category_name(board.getBoardCategoryName())
                    .comments_count((long) board.getComments().size())
                    .files(board.getBoardPhoto().stream()
                            .map(BoardFileDto::toDto)
                            .collect(Collectors.toList()))
                    .is_liked_by_user(isLikedByUser)
                    // ⭐ 댓글 목록을 DTO로 변환하여 설정 ⭐
                    .comments(board.getComments().stream()
                            .map(CommentGetDto::fromEntity) // CommentGetDto의 fromEntity 사용
                            .collect(Collectors.toList()))
                    .build();
        }
    }

    @Getter
    @AllArgsConstructor
    @Builder
    public static class BoardFileDto {
        private Long file_no;
        private String origin_name;
        private String change_name;

        public static BoardFileDto toDto(BoardFile boardFile) {
            return BoardFileDto.builder()
                    .file_no(boardFile.getBoardFileNo())
                    .origin_name(boardFile.getOriginName())
                    .change_name(boardFile.getChangeName())
                    .build();
        }
    }
}