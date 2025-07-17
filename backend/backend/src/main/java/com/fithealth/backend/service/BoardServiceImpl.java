package com.fithealth.backend.service;

import com.fithealth.backend.dto.Board.BoardCreateDto;
import com.fithealth.backend.dto.Board.BoardGetDto;
import com.fithealth.backend.dto.Board.BoardGetDto.Response;
import com.fithealth.backend.dto.Board.BoardUpdateDto;
import com.fithealth.backend.dto.Board.MyBoardGetDto;
import com.fithealth.backend.dto.Board.Top5BoardDto;
import com.fithealth.backend.dto.Comment.MyCommentGetDto;
import com.fithealth.backend.dto.PageResponse;
import com.fithealth.backend.entity.Board;
import com.fithealth.backend.entity.BoardFile;
import com.fithealth.backend.entity.BoardLike;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums;
import com.fithealth.backend.repository.BoardLikeRepository;
import com.fithealth.backend.repository.BoardRepository;
import com.fithealth.backend.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File; // 로컬 파일 시스템 삭제/경로 관련은 일단 유지
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final BoardLikeRepository boardLikeRepository;

    @Override
    @Transactional
    public Long createBoard(BoardCreateDto.Create boardCreateDto) {
        String userEmail = boardCreateDto.getUser_email();

        // userEmail 유효성 검사 (프론트에서 유효한 이메일을 보냈다고 했으므로, DTO 바인딩 문제이거나 극히 드문 경우)
        if (userEmail == null || userEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("사용자 이메일이 필요합니다.");
        }

        Member member = memberRepository.findOne(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("해당 이메일의 회원을 찾을 수 없습니다: " + userEmail));

        Board board = boardCreateDto.toEntity();
        board.changeMember(member);

        // ⭐ 변경된 파일 처리 로직: MultipartFile 대신 S3에 업로드된 파일명 리스트를 처리
        List<String> newFileNames = boardCreateDto.getNew_file_names();
        if (newFileNames != null && !newFileNames.isEmpty()) {
            for (String s3FileName : newFileNames) { // s3FileName은 "community/abc-123.jpg"와 같은 S3 경로
                if (s3FileName != null && !s3FileName.trim().isEmpty()) {
                    // BoardFile 엔티티 생성 및 게시글과 연결
                    // S3에 업로드된 파일의 경우, originName은 알 수 없으므로 changeName과 동일하게 처리하거나
                    // 프론트에서 originName도 함께 전달받아야 합니다.
                    BoardFile boardFile = BoardFile.builder()
                            .originName(s3FileName.substring(s3FileName.lastIndexOf('/') + 1)) // 파일명만 추출
                            .changeName(s3FileName) // S3 전체 경로를 changeName으로 저장
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

        Page<BoardGetDto.Response> dtoPage = boardPage.map(board -> BoardGetDto.Response.toDto(board, false));
        return new PageResponse<>(dtoPage);
    }

    @Override
    public BoardGetDto.Response getBoardDetail(Long boardNo, String userEmail) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));

        boolean isLikedByUser = false;
        if (userEmail != null && !userEmail.isEmpty()) {
            Member member = memberRepository.findOne(userEmail).orElse(null);
            if (member != null) {
                isLikedByUser = boardLikeRepository.findByBoardAndMember(board, member).isPresent();
            }
        }
        return BoardGetDto.Response.toDto(board, isLikedByUser);
    }

    @Override
    public void incrementBoardCount(Long boardNo) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));
        board.setCount(board.getCount() + 1);
        boardRepository.save(board);
    }

    @Override
    public boolean toggleLike(Long boardNo, String userEmail) {
        Board board = boardRepository.findById(boardNo)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));
        Member member = memberRepository.findOne(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다."));

        Optional<BoardLike> existingLike = boardLikeRepository.findByBoardAndMember(board, member);

        if (existingLike.isPresent()) {
            boardLikeRepository.delete(existingLike.get());
            board.setHeart(board.getHeart() - 1);
            boardRepository.save(board);
            return false;
        } else {
            BoardLike boardLike = BoardLike.builder()
                    .board(board)
                    .member(member)
                    .build();
            boardLikeRepository.save(boardLike);
            board.setHeart(board.getHeart() + 1);
            boardRepository.save(board);
            return true;
        }
    }

    @Override
    @Transactional
    public Long updateBoard(BoardUpdateDto.Update boardUpdateDto) {
        Board existingBoard = boardRepository.findById(boardUpdateDto.getBoard_no())
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다: " + boardUpdateDto.getBoard_no()));

        if (existingBoard.getMember() == null || !existingBoard.getMember().getUserEmail().equals(boardUpdateDto.getUser_email())) {
            throw new IllegalArgumentException("게시글을 수정할 권한이 없습니다.");
        }

        existingBoard.updateBoardDetails(
                boardUpdateDto.getBoard_title(),
                boardUpdateDto.getBoard_content(),
                boardUpdateDto.getBoard_category_name()
        );

        List<Long> existingFileNumbersToKeep = boardUpdateDto.getExisting_file_numbers();

        // 1. 기존 파일 삭제 처리 (S3에서는 삭제하지 않고 DB에서만 연결 끊기)
        if (existingBoard.getBoardPhoto() != null && !existingBoard.getBoardPhoto().isEmpty()) {
            List<BoardFile> filesToDeleteFromDb = new ArrayList<>();
            List<BoardFile> filesToKeepInDb = new ArrayList<>();

            for (BoardFile existingFile : existingBoard.getBoardPhoto()) {
                if (existingFileNumbersToKeep == null || !existingFileNumbersToKeep.contains(existingFile.getBoardFileNo())) {
                    // 유지할 파일 목록에 없으면 DB에서 삭제할 대상
                    filesToDeleteFromDb.add(existingFile);
                    // ⭐ 여기에 S3 삭제 로직이 있었으나, 제거하지 않으므로 호출 안 함
                    System.out.println("DEBUG: S3에서는 파일 제거하지 않고, DB에서만 연결 끊기: " + existingFile.getChangeName());
                } else {
                    // 유지할 파일 목록에 있으면 유지 대상
                    filesToKeepInDb.add(existingFile);
                }
            }
            // boardPhoto 컬렉션을 유지할 파일들로만 갱신
            // @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true) 설정되어 있다면
            // filesToDeleteFromDb에 있는 BoardFile 엔티티들이 컬렉션에서 제거되면서 DB에서도 자동으로 삭제됩니다.
            existingBoard.getBoardPhoto().removeAll(filesToDeleteFromDb);
            // 또는 existingBoard.setBoardPhoto(filesToKeepInDb); 와 같이 아예 새 리스트로 교체해도 됩니다.
            // (둘 다 orphanRemoval = true 설정 시 동일하게 작동)
        }


        // 2. 새로운 파일 추가 처리 (프론트에서 넘어온 S3 경로를 사용)
        List<String> newS3FileNames = boardUpdateDto.getNew_file_names();
        if (newS3FileNames != null && !newS3FileNames.isEmpty()) {
            for (String s3FileName : newS3FileNames) {
                if (s3FileName != null && !s3FileName.trim().isEmpty()) {
                    String originName = s3FileName.substring(s3FileName.lastIndexOf('/') + 1);
                    BoardFile newBoardFile = BoardFile.builder()
                            .originName(originName)
                            .changeName(s3FileName)
                            .board(existingBoard)
                            .build();
                    existingBoard.addBoardFile(newBoardFile);
                }
            }
        }

        Board savedBoard = boardRepository.save(existingBoard);
        return savedBoard.getBoardNo();
    }

    @Override
    public void delete(Long boardNo) {
        boardRepository.updateStatusToInactive(boardNo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MyBoardGetDto> getMyBoards(String userEmail) {
        List<Board> boards = boardRepository.findByMemberUserEmail(userEmail);
        return boards.stream()
                .map(MyBoardGetDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<Top5BoardDto.Response> getBoardTop5() {
        return boardRepository.findTop5ByStatusOrderByCountDesc(CommonEnums.Status.Y).stream()
                .map(Top5BoardDto.Response::fromEntity).collect(Collectors.toList());
    }
}