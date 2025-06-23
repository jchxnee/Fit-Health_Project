package com.fithealth.backend.dto.Trainer;

import com.fithealth.backend.entity.Career;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.entity.Trainer;
import com.fithealth.backend.entity.TrainerFile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

public class TrainerDetailDto {

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long trainerNo;
        private String trainerName;
        private String profileImage;
        private String majorName;
        private String wishArea;
        private String kakaoId;
        private String instaId;
        private String introduce;
        private Long oncePrice;
        private Long discount3;
        private Long discount5;
        private Long discount10;
        private List<String> careers;
        private List<FileResponse> trainerPhoto;

        public static Response fromEntity(Trainer trainer, Member member) {
            return Response.builder()
                    .trainerNo(trainer.getTrainerNo())
                    .trainerName(member.getUserName())
                    .profileImage(member.getProfileImage())
                    .majorName(trainer.getMajorName())
                    .wishArea(trainer.getWishArea())
                    .kakaoId(trainer.getKakaoId())
                    .instaId(trainer.getInstaId())
                    .introduce(trainer.getIntroduce())
                    .oncePrice(trainer.getOncePrice())
                    .discount3(trainer.getDiscount3())
                    .discount5(trainer.getDiscount5())
                    .discount10(trainer.getDiscount10())
                    .careers(trainer.getCareers().stream()
                            .map(Career::getContent)
                            .collect(Collectors.toList()))
                    .trainerPhoto(trainer.getTrainerPhoto().stream()
                            .map(FileResponse::fromEntity)
                            .collect(Collectors.toList()))
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FileResponse {
        private String originName;
        private String changeName;

        public static FileResponse fromEntity(TrainerFile trainerFile) {
            return FileResponse.builder()
                    .originName(trainerFile.getOriginName())
                    .changeName(trainerFile.getChangeName())
                    .build();
        }
    }
}
