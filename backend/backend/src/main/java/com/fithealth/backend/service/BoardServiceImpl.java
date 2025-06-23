package com.fithealth.backend.service;

import com.fithealth.backend.dto.Board.BoardCreateDto;
import com.fithealth.backend.dto.Board.BoardGetDto;
import com.fithealth.backend.dto.Board.BoardUpdateDto;
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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional; // ⭐ Optional 임포트 ⭐
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final BoardLikeRepository boardLikeRepository; // ⭐ BoardLikeRepository 주입 ⭐
    private final String UPLOAD_PATH = "C:\\Users\\User\\Pictures\\photo";

    @Override
    public Long createBoard(BoardCreateDto.Create boardCreateDto, List<MultipartFile> files) throws IOException {
        Member member = memberRepository.findOne(boardCreateDto.getUser_email())
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다."));

        Board board = boardCreateDto.toEntity();
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

    @Override
    public Long updateBoard(BoardUpdateDto.Update boardUpdateDto, List<MultipartFile> newFiles) throws IOException {
        // 1. 기존 게시글 조회 (ID로 찾음)
        Board existingBoard = boardRepository.findById(boardUpdateDto.getBoard_no())
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다: " + boardUpdateDto.getBoard_no()));

        // 2. 권한 확인: 요청한 사용자의 이메일과 게시글 작성자의 이메일 비교
        if (existingBoard.getMember() == null || !existingBoard.getMember().getUserEmail().equals(boardUpdateDto.getUser_email())) {
            throw new IllegalArgumentException("게시글을 수정할 권한이 없습니다.");
        }

        existingBoard.updateBoardDetails(
                boardUpdateDto.getBoard_title(),
                boardUpdateDto.getBoard_content(),
                boardUpdateDto.getBoard_category_name()
        );

        List<Long> existingFileNumbersToKeep = boardUpdateDto.getExisting_file_numbers();

        if (existingBoard.getBoardPhoto() != null && !existingBoard.getBoardPhoto().isEmpty()) {
            // 삭제할 파일들을 필터링합니다. (유지할 목록에 없는 파일들)
            List<BoardFile> filesToRemove = existingBoard.getBoardPhoto().stream()
                    .filter(file -> existingFileNumbersToKeep == null || !existingFileNumbersToKeep.contains(file.getBoardFileNo()))
                    .collect(Collectors.toList());

            for (BoardFile file : filesToRemove) {
                // 실제 파일 시스템에서 파일 삭제
                Path filePath = Paths.get(UPLOAD_PATH, file.getChangeName());
                try {
                    Files.deleteIfExists(filePath);
                } catch (IOException e) {
                    System.err.println("파일 삭제 실패: " + filePath + " - " + e.getMessage());
                    // 파일 삭제 실패는 로깅하고 계속 진행합니다.
                }
                // 게시글 엔티티의 파일 컬렉션에서 제거합니다.
                // Board 엔티티의 @OneToMany(..., orphanRemoval = true) 설정 덕분에
                // 여기서 remove()를 호출하면 해당 BoardFile 엔티티는 DB에서도 자동으로 삭제됩니다.
                existingBoard.getBoardPhoto().remove(file);
            }
        }

        // 4-2. 새로운 파일 업로드 및 연결
        // newFiles는 Controller에서 @RequestParam으로 받은 MultipartFile 리스트입니다.
        if (newFiles != null && !newFiles.isEmpty()) {
            // 파일 업로드 디렉토리가 없으면 생성
            Path uploadDirPath = Paths.get(UPLOAD_PATH);
            if (!Files.exists(uploadDirPath)) {
                Files.createDirectories(uploadDirPath);
            }

            for (MultipartFile file : newFiles) {
                if (!file.isEmpty()) {
                    String originName = file.getOriginalFilename();
                    String changeName = UUID.randomUUID().toString() + "_" + originName;

                    // 실제 파일을 서버에 저장
                    Files.copy(file.getInputStream(), uploadDirPath.resolve(changeName), StandardCopyOption.REPLACE_EXISTING);

                    // BoardFile 엔티티 생성 및 기존 게시글과 연결
                    BoardFile boardFile = BoardFile.builder()
                            .originName(originName)
                            .changeName(changeName)
                            .board(existingBoard) // 중요한 부분: 새로 추가된 파일이 어떤 게시글에 속하는지 명시
                            .build();
                    existingBoard.addBoardFile(boardFile); // 게시글 엔티티의 파일 컬렉션에 추가 (양방향 관계 관리)
                }
            }
        }
        return existingBoard.getBoardNo(); // 변경된 엔티티의 ID 반환
    }

    @Override
    public void delete(Long boardNo) {
        boardRepository.updateStatusToInactive(boardNo);
    }
}