package com.fithealth.backend.service;

import com.fithealth.backend.dto.Board.BoardCreateDto;

import java.io.IOException;

public interface BoardService {

    Long createBoard(BoardCreateDto.Create boardDto) throws IOException;
}
