package com.fithealth.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REVIEW_NO")
    private Long reviewNo;

    @Column(name = "USER_NAME")
    private String userName;

    @Column(name = "TRAINER_NO")
    private Long trainerNo;

    @Column(name = "REVIEW_CONTENT")
    private String reviewContent;

    @Column(name = "RATING")
    private Long rating;

    @Column(name = "HEART")
    private Long heart;

    @Column(name = "CREATED_DATE")
    private Date createdDate;

    @Column(name = "STATUS", length = 1, nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status status;

    public class CommonEnums {
        public enum Status {
            Y, N
        }
    }


}
