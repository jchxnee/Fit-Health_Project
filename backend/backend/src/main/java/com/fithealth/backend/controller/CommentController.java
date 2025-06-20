package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Board.BoardCreateDto;
import com.fithealth.backend.dto.Comment.CommentCreateDto;
import com.fithealth.backend.dto.Comment.CommentGetDto;
import com.fithealth.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<Long> createBoard(@RequestBody CommentCreateDto.Create commentCreateDto) {
        return ResponseEntity.ok(commentService.createComment(commentCreateDto));
    }

    @GetMapping("/board/{boardNo}")
    public ResponseEntity<List<CommentGetDto>> getCommentsByBoardNo(@PathVariable Long boardNo) {
        return ResponseEntity.ok(commentService.getCommentsByBoardNo(boardNo));
    }


}
