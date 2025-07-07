package com.fithealth.backend.dto.Recommend;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BmiRequestDto {
    private double bmi;
    private String category;
}
