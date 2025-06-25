// CommentGetDto.java
package com.fithealth.backend.dto.Comment;

import com.fithealth.backend.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder; // Lombok Builder 추가
import lombok.Getter;
import lombok.NoArgsConstructor; // 기본 생성자 추가

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor // DTO는 기본 생성자가 있는 것이 좋습니다.
@AllArgsConstructor
@Builder // 엔티티에서 DTO로 변환할 때 Builder 사용
public class CommentGetDto { // 이전의 Response 내부 클래스 대신 직접 CommentGetDto로 사용
    private Long comment_no; // commentNo -> comment_no (프론트와 일관성 위해)
    private String comment_content; // commentContent (카멜 케이스)
    private LocalDateTime created_date; // createdDate (카멜 케이스)
    private String user_email; // 댓글 작성자 이메일 (Member 엔티티에서 가져옴)
    private String profile_image;
    private String address;
    private String user_name; // 댓글 작성자 이름 (Member 엔티티에서 가져옴)

    // DTO 변환을 위한 fromEntity 메소드 추가 (Service 레이어에서 사용)
    public static CommentGetDto fromEntity(Comment comment) {
        return CommentGetDto.builder()
                .comment_no(comment.getCommentNo())
                .comment_content(comment.getCommentContent())
                .created_date(comment.getCreatedDate())
                .user_email(comment.getMember().getUserEmail())
                .profile_image(comment.getMember().getProfileImage())
                .address(comment.getMember().getAddress())
                .user_name(comment.getMember().getUserName())
                .build();
    }
}

