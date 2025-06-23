package com.fithealth.backend.entity;

import com.fithealth.backend.enums.CommonEnums;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Getter; // Getter 추가
import lombok.Setter; // Setter 추가

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "PAYMENT")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Payment {

    @Id
    @Column(name = "PAYMENT_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_EMAIL", nullable = false, referencedColumnName = "USER_EMAIL")
    private Member member; // 결제자 Member

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RESPONSE_EMAIL", nullable = false, referencedColumnName = "USER_EMAIL")
    private Member responseMember; // 응답자 (트레이너의 Member 정보)

    // Review와의 OneToOne 양방향 매핑 (mappedBy로 연관 관계의 주인이 아님을 명시)
    // "review"는 Review 엔티티에 정의된 Payment 필드의 이름
    @OneToOne(mappedBy = "payment", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Review review; // 이 결제에 대한 리뷰

    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL)
    private List<Reservation> reservations = new ArrayList<>();

    @Column(name = "TRANSACTION_ID", length = 100)
    private String transactionId;

    @Column(name = "PAYMENT_METHOD", length = 10)
    private String paymentMethod;

    @Column(name = "PAYMENT_STATUS", nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status paymentStatus;

    @Column(name = "PAYMENT_AT")
    private LocalDateTime paymentAt;

    @Column(name = "PRODUCT_PRICE", nullable = false)
    private Long productPrice;

    @Column(name = "PRODUCT_NAME", nullable = false, length = 255)
    private String productName;

    @Column(name = "TOTAL_COUNT", nullable = false)
    private Long totalCount;

    @Column(name = "FIRST_RESERVATION", nullable = false)
    private LocalDateTime firstReservation;

    @Column(name = "USE_STATUS" , nullable = false)
    @Enumerated(EnumType.STRING)
    private CommonEnums.UseStatus useStatus;

    @Column(name = "APPLIED_AT", nullable = false, updatable = false)
    private LocalDateTime appliedAt;
    

    @PrePersist
    public void prePersist() {
        this.appliedAt = LocalDateTime.now();

        if(this.paymentStatus == null) {
            this.paymentStatus = CommonEnums.Status.N;
        }

        if(this.useStatus == null) {
            this.useStatus = CommonEnums.UseStatus.Y;
        }
    }

    public void changeMember(Member member) {
        this.member = member;
        if(!member.getPaymentsByMember().contains(this)){
            member.getPaymentsByMember().add(this);
        } else{
            member.getPaymentsByMember().remove(this);
        }
    }

    public void changeResponseMember(Member member) {
        this.responseMember = member;
        if(!responseMember.getPaymentsByResponseMember().contains(this)){
            responseMember.getPaymentsByResponseMember().add(this);
        } else{
            responseMember.getPaymentsByResponseMember().remove(this);
        }
    }

    public void changePayment(CommonEnums.Status status){
        this.paymentStatus = status;
        this.paymentAt = LocalDateTime.now();
    }
}