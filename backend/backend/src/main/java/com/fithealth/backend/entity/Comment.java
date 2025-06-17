package com.fithealth.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import javax.naming.Name;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "COMMENT")
public class Comment {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentNo;

    @Column(name = "COMMNETCONTENT", nullable = false)
    private String commentContent;


    @Column(name = "CREATED_DATE")
    private LocalDateTime createdDate;

    @PrePersist
    public void prePersist() {
        this.createdDate = LocalDateTime.now();
    }


}
