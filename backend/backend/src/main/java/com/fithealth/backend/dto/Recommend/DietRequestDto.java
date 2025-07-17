package com.fithealth.backend.dto.Recommend;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class DietRequestDto {

    private String name;
    private String gender;
    private Integer age;
    private Double height;
    private Double weight;
    private Integer weeklyExerciseFrequency;
    private Double bmr;
    private String goalCategory;
}
