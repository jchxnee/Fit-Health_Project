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

    @Column(name = "CREATED_DATE")
    private LocalDateTime createdDate;

    @PrePersist
    public void prePersist() {
        this.createdDate = LocalDateTime.now();
        if(this.status == null) {
            this.status = CommonEnums.Status.Y;
        }
    }


}
