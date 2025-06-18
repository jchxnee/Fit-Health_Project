package com.fithealth.backend.service;

import com.fithealth.backend.dto.Board.BoardCreateDto;
import com.fithealth.backend.entity.Board;
import com.fithealth.backend.entity.BoardFile; // BoardFile 임포트 확인
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.repository.BoardRepository;
import com.fithealth.backend.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardServiceImpl implements BoardService {

    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final String UPLOAD_PATH = "C:\\dev_tool";

    @Override
    public Long createBoard(BoardCreateDto.Create boardDto) throws IOException {
        Member member = memberRepository.findOne(boardDto.getUser_id())
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다."));

        String originName = null;
        String changeName = null;
        if(boardDto.getFile() != null && !boardDto.getFile().isEmpty()){
            originName = boardDto.getFile()
                    .getOriginalFilename();
            changeName = UUID.randomUUID()
                    .toString() + "_" + originName;

            File upLoadDir = new File(UPLOAD_PATH);
            if(!upLoadDir.exists()){
                upLoadDir.mkdirs();
            }

            boardDto.getFile()
                    .transferTo(new File(UPLOAD_PATH + changeName));
        }

        Board board = boardDto.toEntity();
        board.changeMember(member); // 작성자 설정

        // BoardFile 객체를 생성하고 Board 엔티티의 리스트에 추가해야 합니다.
        if (originName != null && changeName != null) {
            BoardFile boardFile = BoardFile.builder()
                    .originName(originName)
                    .changeName(changeName)
                    .build();
            boardFile.setBoard(board);
        }

        Long savedBoardNo = boardRepository.save(board);
        return savedBoardNo;
    }
}