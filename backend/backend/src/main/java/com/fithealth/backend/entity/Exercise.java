package com.fithealth.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "EXERCISE")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Exercise {

    @Id
    @Column(name = "EXERCISE_NO")
    private Long exerciseNo;

    @Column(name = "EXERCISE_NAME", nullable = false, length = 30)
    private String exerciseName;

    @Column(name = "EXERCISE_TARGET", nullable = false, length = 20)
    private String exerciseTarget;

    @Column(name = "EXERCISE_ITEM", length = 30)
    private String exerciseItem;

    @Column(name = "EXERCISE_WEIGHT")
    private Long exerciseWeight;

    @Column(name = "EXERCISE_COUNT", nullable = false)
    private Long exerciseCount;

    @Column(name = "EXERCISE_SET", nullable = false)
    private Long exerciseSet;

    @Column(name = "EXERCISE_ORIGIN", nullable = false, length = 100)
    private String exerciseOrigin;

    @Column(name = "EXERCISE_CHANGE", nullable = false, length = 100)
    private String exerciseChange;
}
