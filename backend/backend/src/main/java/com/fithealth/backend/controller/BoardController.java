package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Board.BoardCreateDto;
import com.fithealth.backend.dto.Board.BoardGetDto;
import com.fithealth.backend.dto.PageResponse;
import com.fithealth.backend.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping
    public ResponseEntity<Long> createBoard(
            @ModelAttribute BoardCreateDto.Create boardCreateDto,
            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) throws IOException {
        return ResponseEntity.ok(boardService.createBoard(boardCreateDto, files));
    }

    @GetMapping("/all")
    public ResponseEntity<PageResponse<BoardGetDto.Response>> getBoards(
            @RequestParam(defaultValue = "전체") String category,
            @PageableDefault(size = 5, sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable) {

        PageResponse<BoardGetDto.Response> response = boardService.getBoardList(category, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardGetDto.Response> getBoard(
            @PathVariable("id") Long boardNo,
            @RequestParam(value = "userEmail", required = false) String userEmail // ⭐ userEmail 파라미터 추가 ⭐
    ) {
        return ResponseEntity.ok(boardService.getBoardDetail(boardNo, userEmail)); // ⭐ userEmail 전달 ⭐
    }

    @PutMapping("/{id}/view") // ⭐ 조회수 증가 엔드포인트 추가 ⭐
    public ResponseEntity<Void> incrementViewCount(@PathVariable("id") Long boardNo) {
        boardService.incrementBoardCount(boardNo);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/like") // ⭐ 좋아요 토글 엔드포인트 추가 ⭐
    public ResponseEntity<Boolean> toggleLike(
            @PathVariable("id") Long boardNo,
            @RequestBody String userEmail // ⭐ userEmail을 요청 본문으로 받음 ⭐
    ) {
        String parsedUserEmail = userEmail.replace("\"", ""); // JSON 문자열로 넘어올 경우 따옴표 제거
        boolean liked = boardService.toggleLike(boardNo, parsedUserEmail);
        return ResponseEntity.ok(liked); // 좋아요 상태 반환 (true: 좋아요, false: 좋아요 취소)
    }
}