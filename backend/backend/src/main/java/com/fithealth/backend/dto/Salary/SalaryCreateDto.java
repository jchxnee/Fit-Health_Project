package com.fithealth.backend.dto.Salary;

import com.fithealth.backend.entity.Refund;
import com.fithealth.backend.entity.Salary;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class SalaryCreateDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Create{
        private Long payment_id;
        private Long salary_price;
        private Long salary_fee;

        public Salary toEntity(){
            return Salary.builder()
                    .salaryPrice(this.salary_price)
                    .salaryFee(this.salary_fee)
                    .build();
        }
    }
}
