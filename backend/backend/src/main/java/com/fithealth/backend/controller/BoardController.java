package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Board.BoardCreateDto;
import com.fithealth.backend.dto.Board.BoardGetDto;
import com.fithealth.backend.dto.Board.BoardUpdateDto;
import com.fithealth.backend.dto.Board.Top5BoardDto;
import com.fithealth.backend.dto.PageResponse;
import com.fithealth.backend.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // updateBoard 때문에 임포트는 유지

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping // 게시글 생성 (파일 정보는 DTO에 포함된 S3 경로로 받음)
    public ResponseEntity<Long> createBoard(
            @ModelAttribute BoardCreateDto.Create boardCreateDto
    ) throws IOException {
        // boardCreateDto 안에 user_email과 new_file_names (S3 경로)가 모두 포함되어 넘어옴
        return ResponseEntity.ok(boardService.createBoard(boardCreateDto));
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
            @RequestParam(value = "userEmail", required = false) String userEmail
    ) {
        return ResponseEntity.ok(boardService.getBoardDetail(boardNo, userEmail));
    }

    @GetMapping("/myposts")
    public ResponseEntity<PageResponse<BoardGetDto.Response>> getMyPosts(
            @RequestParam(defaultValue = "all") String category,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam("userEmail") String userEmail
    ) {

        if (userEmail == null || userEmail.isEmpty() || "anonymousUser".equals(userEmail)) {
            // 실제 인증이 필요하다면 여기에 SecurityContextHolder를 활용한 인증 로직 추가 필요
            return ResponseEntity.status(401).build(); // 401 Unauthorized
        }

        PageResponse<BoardGetDto.Response> response = boardService.getMyBoardListWithSearch(userEmail, category, search, pageable);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateBoard(
            @ModelAttribute BoardUpdateDto.Update boardUpdateDto
    )  throws IOException {
        // updateBoard는 기존 파일 유지/삭제 및 새로운 MultipartFile을 받는 복합적인 로직이므로,
        // 현재 MultipartFile을 받는 형태로 유지합니다.
        // 만약 update 시에도 S3에 미리 업로드된 파일명만 받는다면, 이 파라미터도 List<String>으로 변경해야 합니다.
        return ResponseEntity.ok(boardService.updateBoard(boardUpdateDto));
    }

    @PutMapping("delete/{id}")
    public ResponseEntity<Long> deleteBoard(@PathVariable("id") Long boardNo){
        boardService.delete(boardNo);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable("id") Long boardNo) {
        boardService.incrementBoardCount(boardNo);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Boolean> toggleLike(
            @PathVariable("id") Long boardNo,
            @RequestBody String userEmail
    ) {
        String parsedUserEmail = userEmail.replace("\"", ""); // JSON 문자열로 넘어올 경우 따옴표 제거
        boolean liked = boardService.toggleLike(boardNo, parsedUserEmail);
        return ResponseEntity.ok(liked);
    }

    @GetMapping("/top5")
    public ResponseEntity<List<Top5BoardDto.Response>> getBoardTop5() {
        return ResponseEntity.ok(boardService.getBoardTop5());
    }
}