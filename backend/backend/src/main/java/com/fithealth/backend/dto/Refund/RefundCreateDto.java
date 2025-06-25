package com.fithealth.backend.dto.Refund;

import com.fithealth.backend.entity.Refund;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class RefundCreateDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Create{
        private Long payment_id;
        private Long refund_price;
        private Long refund_fee;

        public Refund toEntity(){
            return Refund.builder()
                    .refundPrice(this.refund_price)
                    .refundFee(this.refund_fee)
                    .build();
        }
    }
}
