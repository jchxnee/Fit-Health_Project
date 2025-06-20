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
import jakarta.persistence.EntityManager;

@Service
@RequiredArgsConstructor
@Transactional
public class TrainerServiceImpl implements TrainerService {

    private final TrainerRepository trainerRepository;
    private final MemberRepository memberRepository;
    private final EntityManager em;

    @Override
    public String createTrainer(addTrainerDto.Request requestDto) {
        // 1. 이메일로 Member 조회
        Member member = memberRepository.findOne(requestDto.getUserEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 2. Trainer 생성 (member 반드시 넣기)
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

        // 5. 양방향 연관관계 완전 연결
        member.setTrainer(trainer);
        trainer.setMember(member);
        member.setGrade(CommonEnums.Grade.C);

        // 6. Member(주인) 저장 (cascade로 Trainer도 저장됨)
        memberRepository.save(member);

        return "트레이너 등록 성공";
    }

    @Override
    public Long registerTrainer(addTrainerDto.Create trainerDto, List<MultipartFile> files) throws IOException {
        // 1. Trainer 생성 (member 없이 생성, 이후 member에 set)
        Trainer trainer = trainerDto.toEntity();
        // Career 추가
        if (trainerDto.getCareers() != null) {
            for (String content : trainerDto.getCareers()) {
                Career career = Career.builder()
                        .content(content)
                        .trainer(trainer)
                        .build();
                trainer.getCareers().add(career);
            }
        }
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
        // 2. Member 조회 및 연관관계 연결
        if (trainerDto.getUserEmail() != null) {
            Member member = memberRepository.findOne(trainerDto.getUserEmail())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
            member.setTrainer(trainer);
            trainer.setMember(member);
            member.setGrade(CommonEnums.Grade.C);
            memberRepository.save(member);
            return trainer.getTrainerNo();
        } else {
            // Member 정보가 없으면 Trainer만 저장 (비추천)
            Long trainerNo = trainerRepository.save(trainer);
            return trainerNo;
        }
    }
}
