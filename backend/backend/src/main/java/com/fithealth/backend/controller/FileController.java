package com.fithealth.backend.controller;

import com.fithealth.backend.dto.File.UploadUrlResponseDto;
import com.fithealth.backend.service.FileService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/files")
@RestController
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload-url")
    public ResponseEntity<UploadUrlResponseDto> getUploadUrl(@RequestParam String file_name,
                                                             @RequestParam String content_type,
                                                             @RequestParam(required = false, defaultValue = "") String path) {
        //경로 + 변경된이름 + 확장자

        //확장자 추출
        String extention = "";
        int lastDotIndex = file_name.lastIndexOf('.');
        if (lastDotIndex > 0) {
            extention = file_name.substring(lastDotIndex);
        }

        //저장할 이름
        String changeName = path + UUID.randomUUID() + extention;
        String presignedUrl = fileService.generatePresignedUploadUrl(changeName, content_type);

        return ResponseEntity.ok(new UploadUrlResponseDto(changeName, presignedUrl));
    }
}