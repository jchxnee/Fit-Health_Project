package com.fithealth.backend.service;

import com.fithealth.backend.dto.Board.BoardCreateDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BoardService {

    Long createBoard(BoardCreateDto.Create boardDto, List<MultipartFile> files) throws IOException;
}
