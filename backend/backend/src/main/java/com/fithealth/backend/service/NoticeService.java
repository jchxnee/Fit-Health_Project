package com.fithealth.backend.service;

import com.fithealth.backend.dto.Notice.NoticeCreateDto;
import com.fithealth.backend.dto.Notice.NoticeGetDto;
import com.fithealth.backend.dto.Notice.NoticeUpdateDto;
import com.fithealth.backend.dto.PageResponse;
import org.springframework.data.domain.Pageable;

public interface NoticeService {
    Long createNotice(NoticeCreateDto.Create noticeCreateDto);
    PageResponse<NoticeGetDto.Response> getNoticeList(String category, Pageable pageable);
    NoticeGetDto.Response getNoticeDetail(Long noticeNo);

    Long updateNotice(NoticeUpdateDto.Update noticeUpdateDto,  String loggedInUserEmail);

    void delete(Long noticeNo);
}