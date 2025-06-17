package com.fithealth.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@Table(name = "HEALTH")
@DynamicInsert
public class Health {

    @Id
    @Column(name = "USER_EMAIL", length = 254)
    private String userEmail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_EMAIL", nullable = false)
    private Member member;

    @Column(name = "WEIGHT", nullable = false)
    private double weight;

    @Column(name = "SKELETAL_MUSCLE", nullable = false)
    private double skeletalMuscle;

    @Column(name = "BODY_FAT", nullable = false)
    private double bodyFat;

    @Column(name = "CREATE_DATE", nullable = false)
    private LocalDateTime createDate;

    @PrePersist
    public void prePersist() {
        this.createDate = LocalDateTime.now();
    }
}
