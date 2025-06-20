package com.fithealth.backend.service;

import com.fithealth.backend.dto.Health.HealthCreateDto;
import com.fithealth.backend.entity.Health;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.repository.HealthRepository;
import com.fithealth.backend.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HealthServiceImpl implements HealthService {
    private final MemberRepository memberRepository;
    private final HealthRepository healthRepository;

    @Override
    public Long createHealth(HealthCreateDto.Create createDto) {
        Member member = memberRepository.findOne(createDto.getUser_email())
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다."));
        Health health = createDto.toEntity();
        health.changeMember(member);

        healthRepository.save(health);
        return health.getHealthNo();
    }

    @Override
    public List<HealthCreateDto.Response> findHealth(String userEmail) {
        List<Health> healthList = healthRepository.findHealth(userEmail);

        if (healthList.isEmpty()) {
            throw new EntityNotFoundException("건강 정보를 찾을 수 없습니다.");
        }

        return healthList.stream()
                .map(HealthCreateDto.Response::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public LocalDateTime findHealthDate(String userEmail) {
        Health health = healthRepository.findHealthDate(userEmail);

        if(health == null){
            throw new NullPointerException("건강 데이터가 없습니다.");
        }
        return health.getCreateDate();
    }
}
