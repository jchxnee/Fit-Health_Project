package com.fithealth.backend.service;

import com.fithealth.backend.dto.Board.BoardCreateDto;
import com.fithealth.backend.dto.Board.BoardGetDto;
import com.fithealth.backend.dto.PageResponse;
import com.fithealth.backend.entity.Board;
import com.fithealth.backend.entity.BoardFile;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.repository.BoardRepository;
import com.fithealth.backend.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final String UPLOAD_PATH = "C:\\Users\\User\\Pictures\\photo";

    @Override
    public Long createBoard(BoardCreateDto.Create boardDto, List<MultipartFile> files) throws IOException {
        Member member = memberRepository.findOne(boardDto.getUser_email())
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다."));

        Board board = boardDto.toEntity();
        board.changeMember(member);

        if(files != null && !files.isEmpty()){
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String originName = file.getOriginalFilename();
                    String changeName = UUID.randomUUID().toString() + "_" + originName;

                    File uploadDir = new File(UPLOAD_PATH);
                    if(!uploadDir.exists()){
                        uploadDir.mkdirs();
                    }

                    file.transferTo(new File(UPLOAD_PATH + File.separator + changeName));

                    BoardFile boardFile = BoardFile.builder()
                            .originName(originName)
                            .changeName(changeName)
                            .build();
                    board.addBoardFile(boardFile);
                }
            }
        }

        Board savedBoard = boardRepository.save(board);
        return savedBoard.getBoardNo();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<BoardGetDto.Response> getBoardList(String category, Pageable pageable) {
        Page<Board> boardPage; // Page<Board> 타입으로 받습니다.

        if (category == null || "전체".equals(category) || category.isEmpty()) {
            boardPage = boardRepository.findByStatus(CommonEnums.Status.Y, pageable);
        } else {
            boardPage = boardRepository.findByBoardCategoryNameAndStatus(category, CommonEnums.Status.Y, pageable);
        }

        Page<BoardGetDto.Response> dtoPage = boardPage.map(BoardGetDto.Response::toDto);
        return new PageResponse<>(dtoPage);
    }

    @Override
    public BoardGetDto.Response getBoardDetail(Long boardNo) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));
        return BoardGetDto.Response.toDto(board);
    }
}