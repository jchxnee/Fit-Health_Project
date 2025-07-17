package com.fithealth.backend.dto.Board;

import com.fithealth.backend.dto.Board.BoardGetDto.BoardFileDto;
import com.fithealth.backend.dto.Comment.CommentGetDto;
import com.fithealth.backend.dto.Comment.MyCommentGetDto;
import com.fithealth.backend.entity.Board;
import com.fithealth.backend.entity.Comment;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyBoardGetDto {

    private Long board_no;
    private String board_title;
    private String board_content;
    private LocalDateTime created_date;
    private Long count;
    private Long heart;
    private String user_email;
    private String user_name;
    private String profile_image;
    private String address;
    private String board_category_name;
    private Long comments_count;
    private List<BoardFileDto> files;
    private Boolean is_liked_by_user;
    private List<CommentGetDto> comments; // ⭐ 이 줄을 추가하여 댓글 목록 포함 ⭐

    public static MyBoardGetDto fromEntity(Board board) {
        return MyBoardGetDto.builder()
                .board_no(board.getBoardNo())
                .board_title(board.getBoardTitle())
                .created_date(board.getCreatedDate())
                .count(board.getCount())
                .heart(board.getHeart())
                .comments_count((long) board.getComments().size())
                .board_content(board.getBoardContent())
                .user_name(board.getMember().getUserName())
                .profile_image(board.getMember().getProfileImage())
                .address(board.getMember().getAddress())
                .board_category_name(board.getBoardCategoryName())
                .build();
    }
}
