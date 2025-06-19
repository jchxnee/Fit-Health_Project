package com.fithealth.backend.service;

import com.fithealth.backend.dto.Board.BoardCreateDto;
import com.fithealth.backend.dto.Board.BoardGetDto;
import com.fithealth.backend.dto.PageResponse;
import com.fithealth.backend.entity.Board;
import com.fithealth.backend.entity.BoardFile;
import com.fithealth.backend.entity.BoardLike; // ⭐ BoardLike 임포트 ⭐
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.repository.BoardLikeRepository; // ⭐ BoardLikeRepository 임포트 ⭐
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
import java.util.Optional; // ⭐ Optional 임포트 ⭐
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final BoardLikeRepository boardLikeRepository; // ⭐ BoardLikeRepository 주입 ⭐
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
        Page<Board> boardPage;

        if (category == null || "전체".equals(category) || category.isEmpty()) {
            boardPage = boardRepository.findByStatus(CommonEnums.Status.Y, pageable);
        } else {
            boardPage = boardRepository.findByBoardCategoryNameAndStatus(category, CommonEnums.Status.Y, pageable);
        }

        // 목록 조회 시에는 좋아요 여부를 알 수 없으므로, false로 설정하거나 필요에 따라 별도 처리
        Page<BoardGetDto.Response> dtoPage = boardPage.map(board -> BoardGetDto.Response.toDto(board, false));
        return new PageResponse<>(dtoPage);
    }

    @Override
    public BoardGetDto.Response getBoardDetail(Long boardNo, String userEmail) { // ⭐ userEmail 파라미터 추가 ⭐
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));

        // ⭐ 현재 사용자가 이 게시물에 좋아요를 눌렀는지 확인 ⭐
        boolean isLikedByUser = false;
        if (userEmail != null && !userEmail.isEmpty()) {
            Member member = memberRepository.findOne(userEmail).orElse(null);
            if (member != null) {
                isLikedByUser = boardLikeRepository.findByBoardAndMember(board, member).isPresent();
            }
        }
        return BoardGetDto.Response.toDto(board, isLikedByUser); // ⭐ isLikedByUser 전달 ⭐
    }

    @Override
    public void incrementBoardCount(Long boardNo) { // ⭐ 조회수 증가 메서드 구현 ⭐
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));
        board.setCount(board.getCount() + 1);
        boardRepository.save(board); // 변경된 count 저장
    }

    @Override
    public boolean toggleLike(Long boardNo, String userEmail) { // ⭐ 좋아요 토글 메서드 구현 ⭐
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));
        Member member = memberRepository.findOne(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다."));

        Optional<BoardLike> existingLike = boardLikeRepository.findByBoardAndMember(board, member);

        if (existingLike.isPresent()) {
            // 이미 좋아요를 눌렀다면 좋아요 취소
            boardLikeRepository.delete(existingLike.get());
            board.setHeart(board.getHeart() - 1);
            boardRepository.save(board);
            return false; // 좋아요 취소됨
        } else {
            // 좋아요를 누르지 않았다면 좋아요 추가
            BoardLike boardLike = BoardLike.builder()
                    .board(board)
                    .member(member)
                    .build();
            boardLikeRepository.save(boardLike);
            board.setHeart(board.getHeart() + 1);
            boardRepository.save(board);
            return true; // 좋아요 추가됨
        }
    }
}