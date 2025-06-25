package com.fithealth.backend.dto.Comment;

import com.fithealth.backend.entity.Comment;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyCommentGetDto {

    private Long comment_no;
    private String comment_content;
    private LocalDateTime created_date;
    private String user_email;
    private String profile_image;
    private String address;
    private String user_name;
    private Long board_no;
    private String board_title;
    private String board_category_name;

    public static MyCommentGetDto fromEntity(Comment comment) {
        return MyCommentGetDto.builder()
                .comment_no(comment.getCommentNo())
                .comment_content(comment.getCommentContent())
                .created_date(comment.getCreatedDate())
                .user_email(comment.getMember().getUserEmail())
                .profile_image(comment.getMember().getProfileImage())
                .address(comment.getMember().getAddress())
                .user_name(comment.getMember().getUserName())
                .board_no(comment.getBoard().getBoardNo())
                .board_title(comment.getBoard().getBoardTitle())
                .board_category_name(comment.getBoard().getBoardCategoryName())
                .build();
    }
}
