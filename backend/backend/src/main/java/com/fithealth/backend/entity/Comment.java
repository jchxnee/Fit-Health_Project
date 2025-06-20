package com.fithealth.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList; // Board 엔티티의 comments 컬렉션 타입을 List로 가정

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "COMMENT")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentNo;

    @Column(name = "COMMNETCONTENT", nullable = false)
    private String commentContent;

    @Column(name = "CREATED_DATE")
    private LocalDateTime createdDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_EMAIL")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BOARD_NO")
    private Board board;

    @PrePersist
    public void prePersist() {
        this.createdDate = LocalDateTime.now();
    }

    public void changeMember(Member member) {
        this.member = member;
        if (member != null && !member.getComments().contains(this)) { // null 체크 추가
            member.getComments().add(this);
        }
    }

    public void changeBoard(Board board) {
        this.board = board;
        if (board != null && !board.getComments().contains(this)) { // null 체크 추가
            board.getComments().add(this);
        }
    }
}