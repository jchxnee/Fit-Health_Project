package com.fithealth.backend.service;

import com.fithealth.backend.dto.Trainer.addTrainerDto;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.io.IOException;

public interface TrainerService {
    String createTrainer(addTrainerDto.Request requestDto);
    Long registerTrainer(addTrainerDto.Create trainerDto, List<MultipartFile> files) throws IOException;
}
