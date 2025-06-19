package com.fithealth.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "BOARD_LIKE")
@IdClass(BoardLike.BoardLikeId.class)
public class BoardLike {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BOARD_NO")
    private Board board;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_EMAIL")
    private Member member;

    @Column(name = "LIKED_DATE", nullable = false)
    private LocalDateTime likedDate;

    @PrePersist
    public void prePersist() {
        this.likedDate = LocalDateTime.now();
    }

    // 복합 키를 위한 임베디드 클래스
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode // Equals와 HashCode 구현 필수
    public static class BoardLikeId implements Serializable {
        private Board board;
        private Member member;
    }
}