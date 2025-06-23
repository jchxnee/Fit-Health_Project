package com.fithealth.backend.service;

import com.fithealth.backend.dto.Trainer.SelectTrainerDto;
import com.fithealth.backend.dto.Trainer.TrainerDetailDto;
import com.fithealth.backend.dto.Trainer.addTrainerDto;
import com.fithealth.backend.dto.Trainer.UpdateTrainerDto;
import com.fithealth.backend.entity.*;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.repository.MemberRepository;
import com.fithealth.backend.repository.TrainerRepository;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.io.File;
import java.io.IOException;
import java.util.UUID;
import java.util.stream.Collectors;

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

    @Override
    public List<SelectTrainerDto.Response> getAllTrainers() {
        List<Member> coaches = memberRepository.findTrainer();
        return coaches.stream().map(member -> {
            // SelectTrainerDto.Response의 필드에 맞게 데이터 추출 및 가공
            Long trainerNo = (member.getTrainer() != null) ? member.getTrainer().getTrainerNo() : null;
            String trainerName = member.getUserName();

            String wishArea = (member.getTrainer() != null) ? member.getTrainer().getWishArea() : null;
            if (wishArea == null || wishArea.isEmpty()) {
                wishArea = member.getAddress(); // Trainer에 없으면 Member 주소 사용
            }
            if (wishArea == null || wishArea.isEmpty()) {
                wishArea = "지역 정보 없음";
            }

            String majorName = (member.getTrainer() != null) ? member.getTrainer().getMajorName() : "미정";
            String profileImg = member.getProfileImage();
            // 해당 트레이너의 리뷰를 조회하여 평균 별점과 리뷰 수 계산
            TypedQuery<Review> reviewQuery = em.createQuery(
                    "SELECT r FROM Review r WHERE r.payment.responseMember.userEmail = :trainerEmail", Review.class);
            reviewQuery.setParameter("trainerEmail", member.getUserEmail());
            List<Review> reviewsList = reviewQuery.getResultList();

            Double averageRating = 0.0;
            Long reviewsCount = (long) reviewsList.size();

            if (!reviewsList.isEmpty() && reviewsCount > 0) {
                double totalRating = reviewsList.stream()
                        .mapToDouble(Review::getRating)
                        .sum();
                averageRating = Math.round((totalRating / reviewsCount) * 10.0) / 10.0;
            }

            return new SelectTrainerDto.Response(
                    trainerNo,
                    trainerName,
                    wishArea,
                    majorName,
                    profileImg,
                    averageRating,
                    reviewsCount
            );
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TrainerDetailDto.Response getTrainer(Long trainerNo) {
        Member member = memberRepository.findByTrainerNo(trainerNo)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 트레이너를 찾을 수 없습니다. trainerNo: " + trainerNo));

        Trainer trainer = member.getTrainer();
        if (trainer == null) {
            throw new IllegalStateException("해당 멤버는 트레이너 정보를 가지고 있지 않습니다. memberEmail: " + member.getUserEmail());
        }

        return TrainerDetailDto.Response.fromEntity(trainer, member);
    }

    @Override
    @Transactional
    public void updateTrainer(UpdateTrainerDto.Request requestDto) {
        Trainer trainer = em.find(Trainer.class, requestDto.getTrainerNo());
        if (trainer == null) {
            throw new IllegalArgumentException("해당 트레이너가 존재하지 않습니다. trainerNo: " + requestDto.getTrainerNo());
        }
        trainer.setMajorName(requestDto.getMajorName());
        trainer.setWishArea(requestDto.getWishArea());
        trainer.setKakaoId(requestDto.getKakaoId());
        trainer.setInstaId(requestDto.getInstaId());
        trainer.setIntroduce(requestDto.getIntroduce());
        trainer.setOncePrice(requestDto.getOncePrice());
        trainer.setDiscount3(requestDto.getDiscount3());
        trainer.setDiscount5(requestDto.getDiscount5());
        trainer.setDiscount10(requestDto.getDiscount10());
        trainer.getCareers().clear();
        if (requestDto.getCareers() != null) {
            for (String content : requestDto.getCareers()) {
                Career career = Career.builder()
                        .content(content)
                        .trainer(trainer)
                        .build();
                trainer.getCareers().add(career);
            }
        }
        trainer.getTrainerPhoto().clear();
        if (requestDto.getTrainerPhoto() != null) {
            for (addTrainerDto.FileRequest file : requestDto.getTrainerPhoto()) {
                TrainerFile trainerFile = TrainerFile.builder()
                        .trainer(trainer)
                        .originName(file.getOriginName())
                        .changeName(file.getChangeName())
                        .build();
                trainer.getTrainerPhoto().add(trainerFile);
            }
        }
    }

    @Override
    @Transactional
    public void patchTrainer(Long trainerNo, java.util.Map<String, Object> updates) {
        Trainer trainer = em.find(Trainer.class, trainerNo);
        if (trainer == null) throw new IllegalArgumentException("해당 트레이너가 존재하지 않습니다.");

        updates.forEach((key, value) -> {
            switch (key) {
                case "majorName": trainer.setMajorName((String) value); break;
                case "wishArea": trainer.setWishArea((String) value); break;
                case "kakaoId": trainer.setKakaoId((String) value); break;
                case "instaId": trainer.setInstaId((String) value); break;
                case "introduce": trainer.setIntroduce((String) value); break;
                case "oncePrice": trainer.setOncePrice(Long.valueOf(value.toString())); break;
                case "discount3": trainer.setDiscount3(Long.valueOf(value.toString())); break;
                case "discount5": trainer.setDiscount5(Long.valueOf(value.toString())); break;
                case "discount10": trainer.setDiscount10(Long.valueOf(value.toString())); break;
                case "careers":
                    trainer.getCareers().clear();
                    if (value instanceof java.util.List) {
                        for (Object c : (java.util.List<?>) value) {
                            Career career = Career.builder().content((String) c).trainer(trainer).build();
                            trainer.getCareers().add(career);
                        }
                    }
                    break;
                case "trainerPhoto":
                    trainer.getTrainerPhoto().clear();
                    if (value instanceof java.util.List) {
                        for (Object f : (java.util.List<?>) value) {
                            java.util.Map fileMap = (java.util.Map) f;
                            String originName = (String) fileMap.get("originName");
                            String changeName = (String) fileMap.get("changeName");
                            if (originName != null && changeName != null) { // null 방어
                                TrainerFile tf = TrainerFile.builder()
                                    .trainer(trainer)
                                    .originName(originName)
                                    .changeName(changeName)
                                    .build();
                                trainer.getTrainerPhoto().add(tf);
                            }
                        }
                    }
                    break;
                // 필요시 추가 필드
            }
        });
    }
}
