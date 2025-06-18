package com.fithealth.backend.entity;

import com.fithealth.backend.enums.CommonEnums;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "REVIEW")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REVIEW_NO")
    private Long reviewNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_EMAIL", nullable = false)
    private Member member; // 리뷰 작성자 Member

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRAINER_NO", nullable = false)
    private Trainer trainer; // 리뷰 대상 트레이너

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PAYMENT_ID", nullable = false, unique = true) // 1대1 관계이므로 unique = true 필수
    private Payment payment;

    @Lob
    @Column(name = "REVIEW_CONTENT", nullable = false)
    private String reviewContent;

    @Column(name = "RATING", nullable = false)
    private Double rating;

    @Column(name = "HEART", nullable = false)
    private Long heart = 0L;

    @Column(name = "CREATED_DATE", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "STATUS", length = 1, nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status status;


    @PrePersist
    protected void prePersist() {
        this.createdDate = LocalDateTime.now();
        if(this.status == null) {
            this.status = CommonEnums.Status.Y;
        }
    }
}