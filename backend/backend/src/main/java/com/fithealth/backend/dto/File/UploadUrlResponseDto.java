package com.fithealth.backend.dto.File;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UploadUrlResponseDto {
    private String change_name;
    private String presigned_url;
}
