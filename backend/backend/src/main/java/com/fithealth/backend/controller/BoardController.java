package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Board.BoardCreateDto;
import com.fithealth.backend.entity.Board;
import com.fithealth.backend.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BoardController {

    private final BoardService boardService;

    @PostMapping
    public ResponseEntity<Long> createBoard(@ModelAttribute BoardCreateDto.Create boardCreate) throws IOException {
        return ResponseEntity.ok(boardService.createBoard(boardCreate));
    }
}
