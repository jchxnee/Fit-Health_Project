package com.fithealth.backend.service;

import com.fithealth.backend.dto.Board.BoardCreateDto;
import com.fithealth.backend.dto.Board.BoardGetDto;
import com.fithealth.backend.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BoardService {

    Long createBoard(BoardCreateDto.Create boardDto, List<MultipartFile> files) throws IOException;
    PageResponse<BoardGetDto.Response> getBoardList(String category, Pageable pageable);
    BoardGetDto.Response getBoardDetail(Long boardNo);
}