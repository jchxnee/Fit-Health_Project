package com.fithealth.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TrainerFile {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRAINER_NO")
    private Trainer trainer;

    @Column(name = "ORIGIN_NAME", nullable = false)
    private String originName;

    @Column(name = "CHANGE_NAME", nullable = false)
    private String changeName;
}
