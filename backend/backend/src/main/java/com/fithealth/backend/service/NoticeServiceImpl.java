package com.fithealth.backend.service;

import com.fithealth.backend.dto.Notice.NoticeCreateDto;
import com.fithealth.backend.dto.Notice.NoticeGetDto;
import com.fithealth.backend.dto.Notice.NoticeUpdateDto;
import com.fithealth.backend.dto.PageResponse;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.entity.Notice;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.repository.MemberRepository;
import com.fithealth.backend.repository.NoticeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;
    private final MemberRepository memberRepository;


    @Override
    public Long createNotice(NoticeCreateDto.Create noticeCreateDto) {
        Member member = memberRepository.findOne(noticeCreateDto.getUser_email())
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다."));

        Notice notice = noticeCreateDto.toEntity();
        notice.changeMember(member);

        Notice savedNotice = noticeRepository.save(notice);
        return savedNotice.getNoticeNo();
    }

    @Override
    public PageResponse<NoticeGetDto.Response> getNoticeList(String category, Pageable pageable) {
        Page<Notice> noticePage;

        if (category == null || "전체".equals(category) || category.isEmpty()) {
            noticePage = noticeRepository.findByStatus(CommonEnums.Status.Y, pageable);
        } else {
            noticePage = noticeRepository.findByNoticeCategoryNameAndStatus(category, CommonEnums.Status.Y, pageable);
        }

        Page<NoticeGetDto.Response> dtoPage = noticePage.map(NoticeGetDto.Response::toDto); // 메서드 참조 사용
        return new PageResponse<>(dtoPage);
    }

    @Override
    public NoticeGetDto.Response getNoticeDetail(Long noticeNo) {
        Notice notice = noticeRepository.findById(noticeNo)
                .orElseThrow(() -> new EntityNotFoundException("공지사항을 찾을 수 없습니다.")); // 오타 수정: 업습니다 -> 없습니다

        // 엔티티를 DTO로 변환하여 반환
        return NoticeGetDto.Response.toDto(notice);
    }

    @Override
    @Transactional
    public Long updateNotice(NoticeUpdateDto.Update noticeUpdateDto, String loggedInUserEmail) {
        Notice existingNotice = noticeRepository.findById(noticeUpdateDto.getNotice_no())
                .orElseThrow(() -> new EntityNotFoundException("공지글을 찾을 수 없습니다: " + noticeUpdateDto.getNotice_no()));

        System.out.println("로그인된 사용자 이메일 (loggedInUserEmail): " + loggedInUserEmail);
        Member loggedInMember = memberRepository.findOne(loggedInUserEmail)
                .orElseThrow(() -> {
                    System.out.println("오류: " + loggedInUserEmail + "에 해당하는 회원을 찾을 수 없습니다.");
                    return new EntityNotFoundException("로그인된 사용자를 찾을 수 없습니다.");
                });
        System.out.println("조회된 로그인 멤버의 등급: " + loggedInMember.getGrade()); // 여기서 Grade 객체가 출력됨

        // ⭐ 중요: Grade 타입에 따라 비교 방식 변경
        // 1. Grade가 enum이고, 'A'가 enum 상수로 정의되어 있을 경우 (가장 유력)
        if (!loggedInMember.getGrade().equals(CommonEnums.Grade.A)) { // CommonEnums.Grade.A 와 직접 비교
            throw new IllegalArgumentException("공지글을 수정할 권한이 없습니다.");
        }

        existingNotice.updateNoticeDetails(
                noticeUpdateDto.getNotice_title(),
                noticeUpdateDto.getNotice_content(),
                noticeUpdateDto.getNotice_category_name()
        );

        noticeRepository.save(existingNotice);

        return existingNotice.getNoticeNo();
    }

    @Override
    public void delete(Long noticeNo) {
        noticeRepository.updateStatusToInactive(noticeNo);
    }


}