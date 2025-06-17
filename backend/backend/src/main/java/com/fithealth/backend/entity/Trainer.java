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
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TRAINER_NO")
    private Long trainerNo;

    @Column(name = "WISH_AREA")
    private String wishArea;

    @Column(name = "KAKAO_ID")
    private String kakaoId;

    @Column(name = "INSTA_ID")
    private String instaId;

    @Column(name = "MAJOR_NAME")
    private String majorName;

    @Column(name = "ONCE_PRICE")
    private Long oncePrice;

    @Column(name = "DISCOUNT_3")
    private Long discount3;

    @Column(name = "DISCOUNT_5")
    private Long discount5;

    @Column(name = "DISCOUNT_10")
    private Long discount10;

    @Column(name = "INTRODUCE")
    private String introduce;

    @OneToMany(mappedBy = "trainer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Career> careers = new ArrayList<>();



}
