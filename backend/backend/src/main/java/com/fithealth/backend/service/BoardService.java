package com.fithealth.backend.service;

import com.fithealth.backend.dto.Board.BoardCreateDto;
import com.fithealth.backend.dto.Board.BoardGetDto;
import com.fithealth.backend.dto.Board.BoardGetDto.Response;
import com.fithealth.backend.dto.Board.BoardUpdateDto;
import com.fithealth.backend.dto.Board.MyBoardGetDto;
import com.fithealth.backend.dto.Board.Top5BoardDto;
import com.fithealth.backend.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BoardService {
    // ⭐ 변경: List<MultipartFile> files 파라미터 삭제
    Long createBoard(BoardCreateDto.Create boardDto) throws IOException;
    PageResponse<BoardGetDto.Response> getBoardList(String category, Pageable pageable);
    BoardGetDto.Response getBoardDetail(Long boardNo, String userEmail);
    void incrementBoardCount(Long boardNo);
    boolean toggleLike(Long boardNo, String userEmail);

    // updateBoard는 여전히 MultipartFile을 받을 수 있도록 유지 (새 파일 업로드용)
    Long updateBoard(BoardUpdateDto.Update boardUpdateDto) throws IOException;

    void delete(Long boardNo);

    List<MyBoardGetDto> getMyBoards(String userEmail);

    List<Top5BoardDto.Response> getBoardTop5();
}