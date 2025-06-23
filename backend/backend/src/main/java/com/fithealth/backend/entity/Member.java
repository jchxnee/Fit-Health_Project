package com.fithealth.backend.entity;

import com.fithealth.backend.enums.CommonEnums;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@Setter
@Table(name = "MEMBER")
@DynamicInsert
@DynamicUpdate
public class Member {
    @Id
    @Column(name = "USER_EMAIL", length = 254)
    private String userEmail;

    @Column(name = "USER_PWD", length = 100, nullable = false)
    private String userPwd;

    //회원 : 트레이너 (1 : 1)
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "TRAINER_NO", unique = true)
    private Trainer trainer;

    @Column(name = "USER_NAME", length = 20, nullable = false)
    private String userName;

    @Column(name = "BIRTH")
    private LocalDate birth;

    @Column(length = 11)
    private String phone;

    @Column(name = "ADDRESS",length = 100)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(length = 1)
    private CommonEnums.Gender gender;

    @Column(name = "HEIGHT")
    private double height;

    @Column(name = "GOAL",length = 30)
    private String goal;

    @Column(name = "PROFILE_IMAGE",length = 255)
    private String profileImage;

    @Enumerated(EnumType.STRING)
    @Column(length = 1, nullable = false)
    private CommonEnums.Status status;

    @Enumerated(EnumType.STRING)
    @Column(length = 1, nullable = false)
    private CommonEnums.Grade grade;

    @Column(name = "ENROLL_DATE", nullable = false)
    private LocalDateTime enrollDate;

    @Column(name = "MODIFY_DATE", nullable = false)
    private LocalDateTime modifyDate;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Payment> paymentsByMember = new ArrayList<>();

    @OneToMany(mappedBy = "responseMember", cascade = CascadeType.ALL)
    private List<Payment> paymentsByResponseMember = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    //1 : N 연관관계 주인 = Board
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Board> boards = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Notice> notices = new ArrayList<>();


    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Health> healths = new ArrayList<>();


    @PrePersist
    public void prePersist() {
        this.enrollDate = LocalDateTime.now();
        this.modifyDate = LocalDateTime.now();

        if(this.status == null) {
            this.status = CommonEnums.Status.Y;
        }

        if(this.grade == null) {
            this.grade = CommonEnums.Grade.U;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.modifyDate = LocalDateTime.now();
    }

    public void changeProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public void changeName(String userName) {
        this.userName = userName;
    }

    public void changeBirth(LocalDate birth) {
        this.birth = birth;
    }

    public void changeInfo(String phone, String address, CommonEnums.Gender gender, Double height, String goal) {
        this.phone = phone;
        this.address = address;
        this.gender = gender;
        this.height = height;
        this.goal = goal;
    }

    public void changePwd(String userPwd) {
        this.userPwd = userPwd;
    }

    public void changeStatus(CommonEnums.Status status){
        this.status = status;
    }

}
