package com.fithealth.backend.service;

import com.fithealth.backend.dto.Board.BoardCreateDto;
import com.fithealth.backend.entity.Board;
import com.fithealth.backend.entity.BoardFile;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.repository.BoardRepository;
import com.fithealth.backend.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile; // MultipartFile 임포트

import java.io.File;
import java.io.IOException;
import java.util.List; // List 임포트
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardServiceImpl implements BoardService {

    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;
    private final String UPLOAD_PATH = "C:\\dev_tool";

    @Override
    public Long createBoard(BoardCreateDto.Create boardDto, List<MultipartFile> files) throws IOException {
        Member member = memberRepository.findOne(boardDto.getUser_email())
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다."));

        Board board = boardDto.toEntity();
        board.changeMember(member); // 작성자 연결 (양방향 관계)

        if(files != null && !files.isEmpty()){
            for (MultipartFile file : files) { // 각 파일마다 처리
                if (!file.isEmpty()) { // 빈 파일이 아닌 경우에만 처리
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
                    board.addBoardFile(boardFile); // Board 엔티티의 편의 메서드 호출
                }
            }
        }

        Long BoardNo = boardRepository.save(board);
        return BoardNo;
    }

}