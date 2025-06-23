package com.fithealth.backend.entity;

import com.fithealth.backend.enums.CommonEnums;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "BOARD")
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long boardNo;

    @Column(name = "BOARD_TITLE", nullable = false)
    private String boardTitle;

    @Column(name = "BOARD_CONTENT", nullable = false)
    private String boardContent;

    @Column(name = "BOARD_CATEGORY_NAME", nullable = false)
    private String boardCategoryName;

    @Column(name = "COUNT", nullable = false)
    private Long count;

    @Column(name = "HEART",nullable = false)
    private Long heart;

    @Column(name = "CREATED_DATE")
    private LocalDateTime createdDate;

    @Column(length = 1)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_EMAIL")
    private Member member;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)
    @OrderBy("createdDate DESC")
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BoardFile> boardPhoto = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdDate = LocalDateTime.now();
        if(this.status == null) {
            this.status = CommonEnums.Status.Y;
        }
        if (this.count == null) {
            this.count = 0L;
        }
        if (this.heart == null) {
            this.heart = 0L;
        }
    }

    public void changeMember(Member member) {
        this.member = member;
        if(!member.getBoards().contains(this)) {
            member.getBoards().add(this);
        }
    }

    public void addBoardFile(BoardFile boardFile) {
        if (this.boardPhoto == null) {
            this.boardPhoto = new ArrayList<>();
        }
        this.boardPhoto.add(boardFile); // BoardFile을 리스트에 추가
        boardFile.setBoard(this);      // BoardFile에게 자신이 어떤 Board에 속하는지 알려줌
    }

    public void updateBoardDetails(String boardTitle, String boardContent, String boardCategoryName) {
        this.boardTitle = boardTitle;
        this.boardContent = boardContent;
        this.boardCategoryName = boardCategoryName;
    }
}