package com.fithealth.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BoardFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BOARD_FILE_NO")
    private Long boardFileNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BOARD_NO", nullable = false) // BOARD_NO는 외래키이자, 각 파일이 어떤 게시글에 속하는지 명확히 함.
    private Board board;

    @Column(name = "ORIGIN_NAME", nullable = false)
    private String originName;

    @Column(name = "CHANGE_NAME", nullable = false)
    private String changeName;

    // Board 엔티티와의 양방향 관계 설정을 위한 편의 메서드 추가 (필요시)
    public void setBoard(Board board) {
        this.board = board;
        if (board != null && !board.getBoardPhoto().contains(this)) {
            board.getBoardPhoto().add(this);
        }
    }

    public void changeFile(String originName, String changeName) {
        this.originName = originName;
        this.changeName = changeName;
    }
}