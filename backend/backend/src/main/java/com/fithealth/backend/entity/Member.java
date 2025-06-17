package com.fithealth.backend.entity;

import com.fithealth.backend.enums.CommonEnums;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@Table(name = "MEMBER")
@DynamicInsert
@DynamicUpdate
public class Member {
    @Id
    @Column(name = "USER_EMAIL", length = 254)
    private String userEmail;

    @Column(name = "USER_PWD", length = 100, nullable = false)
    private String userPwd;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "TRAINER_NO", unique = true)
    private Trainer trainer;

    @Column(name = "USER_NAME", length = 20, nullable = false)
    private String userName;

    @Column(name = "BIRTH")
    private LocalDateTime birth;

    @Column(length = 11)
    private String phone;

    @Column(name = "ADDRESS",length = 100)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(length = 1)
    private Gender gender;

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
    private Grade grade;

    @Column(name = "ENROLL_DATE", nullable = false)
    private LocalDateTime enrollDate;

    @Column(name = "MODIFY_DATE", nullable = false)
    private LocalDateTime modifyDate;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<PAYMENT> payments = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<COMMENT> comments = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<BOARD> boards = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<NOTICE> notices = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<REVIEW> reviews = new ArrayList<>();

    public enum Gender {
        M, F
    }

    public enum Status {
        Y, N
    }

    public enum Grade {
        A, U, C
    }

    @PrePersist
    public void prePersist() {
        this.enrollDate = LocalDateTime.now();
        this.modifyDate = LocalDateTime.now();

        if(this.status == null) {
            this.status = CommonEnums.Status.Y;
        }

        if(this.grade == null) {
            this.grade = Grade.U;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.modifyDate = LocalDateTime.now();
    }
}
