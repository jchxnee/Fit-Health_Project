package com.fithealth.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Career {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CAREER_NO")
    private Long careerNo;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRAINER_NO")
    private Trainer trainer;

    @Column(name = "CONTENT")
    private String content;
}
