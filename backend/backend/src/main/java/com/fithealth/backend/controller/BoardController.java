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
            @RequestParam(defaultValue = "전체") String category, // "전체"를 기본값으로 설정
            @PageableDefault(size = 5, sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable) {

        PageResponse<BoardGetDto.Response> response = boardService.getBoardList(category, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardGetDto.Response> getBoard(@PathVariable("id") Long boardNo) {
        return ResponseEntity.ok(boardService.getBoardDetail(boardNo));
    }
}