package com.fithealth.backend.dto.Recommend;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter; // Setter가 필요하면 추가 (AI 응답 매핑 시 필요할 수 있음)

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecommendDietDto {

    private MealPlan breakfast;
    private MealPlan lunch;
    private MealPlan dinner;
    private String totalDailyCalories;


    //식단표
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MealPlan {
        private List<String> menu;
        private String description;
        private Nutrients nutrients;
        private String calories;
    }

   
    //영양소
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Nutrients {
        private int carbsPercentage;
        private int proteinPercentage;
        private int fatsPercentage;
    }
}
