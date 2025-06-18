package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Board.BoardCreateDto; // DTO 임포트
import com.fithealth.backend.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // MultipartFile 임포트

import java.io.IOException;
import java.util.List; // List 임포트

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping
    public ResponseEntity<Long> createBoard(
            @ModelAttribute BoardCreateDto.Create boardCreateDto, // 텍스트 필드는 @ModelAttribute로 받음
            @RequestParam(value = "files", required = false) List<MultipartFile> files // 파일은 @RequestParam으로 받음
    ) throws IOException {
        return ResponseEntity.ok(boardService.createBoard(boardCreateDto, files));
    }
}