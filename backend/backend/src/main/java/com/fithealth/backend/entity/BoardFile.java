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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BOARD_NO")
    private Board board;

    @Column(name = "ORIGIN_NAME", nullable = false)
    private String originName;

    @Column(name = "CHANGE_NAME", nullable = false)
    private String changeName;
}
