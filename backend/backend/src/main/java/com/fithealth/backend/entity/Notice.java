package com.fithealth.backend.entity;

import com.fithealth.backend.enums.CommonEnums;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "NOTICE")
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long NoticeNo;

    @Column(name = "NOTICE_TITLE", nullable = false)
    private String noticeTitle;

    @Column(name = "NOTICE_CONTENT", nullable = false)
    private String noticeContent;

    @Column(name = "NOTICE_CATEGORY_NAME")
    private String noticeCategoryName;

    @Column(name = "CREATED_DATE")
    private LocalDateTime createdDate;

    @Column(length = 1)
    @Enumerated(EnumType.STRING)
    private CommonEnums.Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_EMAIL")
    private Member member;

    @PrePersist
    public void prePersist() {
        this.createdDate = LocalDateTime.now();
        if(this.status == null) {
            this.status = CommonEnums.Status.Y;
        }
    }


    public void changeMember(Member member) {
        this.member = member;
        if(!member.getNotices().contains(this)) {
            member.getNotices().add(this);
        }
    }
}
