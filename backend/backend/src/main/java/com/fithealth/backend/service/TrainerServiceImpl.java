package com.fithealth.backend.service;

import com.fithealth.backend.dto.Trainer.addTrainerDto;
import com.fithealth.backend.entity.Career;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.entity.Trainer;
import com.fithealth.backend.entity.TrainerFile;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.repository.MemberRepository;
import com.fithealth.backend.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TrainerServiceImpl implements TrainerService {

    private final TrainerRepository trainerRepository;
    private final MemberRepository memberRepository;

    @Override
    public String createTrainer(addTrainerDto.Request requestDto) {
        // 1. 이메일로 Member 조회
        Member member = memberRepository.findOne(requestDto.getUserEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 2. Trainer 생성
        Trainer trainer = requestDto.toTrainerEntity(member);

        // 3. Career 추가
        for (String content : requestDto.getCareers()) {
            Career career = Career.builder()
                    .content(content)
                    .trainer(trainer)
                    .build();
            trainer.getCareers().add(career);
        }

        // 4. TrainerFile 추가
        for (addTrainerDto.FileRequest file : requestDto.getTrainerPhoto()) {
            TrainerFile trainerFile = TrainerFile.builder()
                    .trainer(trainer)
                    .originName(file.getOriginName())
                    .changeName(file.getChangeName())
                    .build();
            trainer.getTrainerPhoto().add(trainerFile);
        }

        // 5. Trainer 저장 (연관된 Career, TrainerFile도 함께 저장됨)
        trainerRepository.save(trainer);

        // 6. Member와의 연관관계 설정 및 grade 업데이트
        member.setTrainer(trainer);
        member.setGrade(CommonEnums.Grade.C);

        return "트레이너 등록 성공";
    }

    @Override
    public Long registerTrainer(addTrainerDto.Create trainerDto, List<MultipartFile> files) throws IOException {
        // 예시: 회원 찾기, 트레이너 엔티티 생성 등
        Trainer trainer = trainerDto.toEntity();
        // 파일 저장 경로
        String UPLOAD_PATH = "E:\\test";
        if(files != null && !files.isEmpty()){
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String originName = file.getOriginalFilename();
                    String changeName = UUID.randomUUID().toString() + "_" + originName;
                    File uploadDir = new File(UPLOAD_PATH);
                    if(!uploadDir.exists()){
                        uploadDir.mkdirs();
                    }
                    file.transferTo(new File(UPLOAD_PATH + File.separator + changeName));
                    TrainerFile trainerFile = TrainerFile.builder()
                            .originName(originName)
                            .changeName(changeName)
                            .build();
                    trainer.addTrainerFile(trainerFile);
                }
            }
        }
        Long trainerNo = trainerRepository.save(trainer);
        return trainerNo;
    }
}
