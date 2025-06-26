package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Board.BoardCreateDto;
import com.fithealth.backend.dto.Board.BoardGetDto;
import com.fithealth.backend.dto.Notice.NoticeCreateDto;
import com.fithealth.backend.dto.Notice.NoticeGetDto;
import com.fithealth.backend.dto.Notice.NoticeUpdateDto;
import com.fithealth.backend.dto.PageResponse;
import com.fithealth.backend.entity.Notice;
import com.fithealth.backend.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/notice")
@RequiredArgsConstructor
public class NoticeController {
    private final NoticeService noticeService;

    @PostMapping
    public ResponseEntity<Long> createNotice(@ModelAttribute NoticeCreateDto.Create noticeCreateDto) {
        return ResponseEntity.ok( noticeService.createNotice(noticeCreateDto));
    }

    @GetMapping("/all")
    public ResponseEntity<PageResponse<NoticeGetDto.Response>> getNotices(
            @RequestParam(defaultValue = "전체") String category,
            @PageableDefault(size = 10, sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable){

        PageResponse<NoticeGetDto.Response> response = noticeService.getNoticeList(category, pageable);
        return ResponseEntity.ok(response);

    }

    @GetMapping("/{id}")
    public ResponseEntity<NoticeGetDto.Response> getBoard(@PathVariable("id") Long noticeNo) {
        return ResponseEntity.ok(noticeService.getNoticeDetail(noticeNo)); // 세미콜론 누락 수정
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateBoard(@ModelAttribute NoticeUpdateDto.Update noticeUpdateDto) {
        String loggedInUserEmail = noticeUpdateDto.getUser_email();
        return ResponseEntity.ok(noticeService.updateNotice(noticeUpdateDto, loggedInUserEmail));
    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<Long> deleteBoard(@PathVariable("id") Long noticeNo) {
        noticeService.delete(noticeNo);
        return ResponseEntity.ok().build();
    }

}