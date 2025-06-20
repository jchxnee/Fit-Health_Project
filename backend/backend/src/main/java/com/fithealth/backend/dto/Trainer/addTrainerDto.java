package com.fithealth.backend.dto.Trainer;

import com.fithealth.backend.entity.Member;
import com.fithealth.backend.entity.Trainer;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

public class addTrainerDto {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request {
        private String userEmail;
        private String majorName, wishArea, kakaoId, instaId, introduce;
        private Long oncePrice, discount3, discount5, discount10;
        private List<String> careers = new ArrayList<>();
        private List<FileRequest> trainerPhoto = new ArrayList<>();

        public Trainer toTrainerEntity(Member member) {
            return Trainer.builder()
                    .member(member)
                    .majorName(this.majorName)
                    .wishArea(this.wishArea)
                    .kakaoId(this.kakaoId)
                    .instaId(this.instaId)
                    .oncePrice(this.oncePrice)
                    .discount3(this.discount3)
                    .discount5(this.discount5)
                    .discount10(this.discount10)
                    .introduce(this.introduce)
                    .careers(new ArrayList<>())
                    .trainerPhoto(new ArrayList<>())
                    .build();
        }
    }

    @Getter @Setter
    public static class FileRequest {
        private String originName, changeName;
    }
    
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Create {
        private String userEmail;
        private String majorName, wishArea, kakaoId, instaId, introduce;
        private Long oncePrice, discount3, discount5, discount10;
        private List<String> careers = new ArrayList<>();
        private List<FileRequest> trainerPhoto = new ArrayList<>();

        public Trainer toEntity() {
            return Trainer.builder()
                    .majorName(this.majorName != null ? this.majorName : "")
                    .wishArea(this.wishArea != null ? this.wishArea : "")
                    .kakaoId(this.kakaoId != null ? this.kakaoId : "")
                    .instaId(this.instaId != null ? this.instaId : "")
                    .oncePrice(this.oncePrice != null ? this.oncePrice : 0L)
                    .discount3(this.discount3 != null ? this.discount3 : 0L)
                    .discount5(this.discount5 != null ? this.discount5 : 0L)
                    .discount10(this.discount10 != null ? this.discount10 : 0L)
                    .introduce(this.introduce != null ? this.introduce : "")
                    .careers(new ArrayList<>())
                    .trainerPhoto(new ArrayList<>())
                    .build();
        }
    }
}
