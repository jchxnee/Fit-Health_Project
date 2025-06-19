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
}
