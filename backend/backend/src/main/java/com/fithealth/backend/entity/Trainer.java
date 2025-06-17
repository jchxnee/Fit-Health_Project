package com.fithealth.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "TRAINER")
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TRAINER_NO", nullable = false)
    private Long trainerNo;

    @Column(name = "WISH_AREA", nullable = false)
    private String wishArea;

    @Column(name = "KAKAO_ID")
    private String kakaoId;

    @Column(name = "INSTA_ID")
    private String instaId;

    @Column(name = "MAJOR_NAME", nullable = false)
    private String majorName;

    @Column(name = "ONCE_PRICE", nullable = false)
    private Long oncePrice;

    @Column(name = "DISCOUNT_3", nullable = false)
    private Long discount3;

    @Column(name = "DISCOUNT_5", nullable = false)
    private Long discount5;

    @Column(name = "DISCOUNT_10", nullable = false)
    private Long discount10;

    @Column(name = "INTRODUCE")
    private String introduce;

    @OneToMany(mappedBy = "trainer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Career> careers = new ArrayList<>();

    @OneToMany(mappedBy = "trainer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrainerFile> trainerPhoto = new ArrayList<>();



}
