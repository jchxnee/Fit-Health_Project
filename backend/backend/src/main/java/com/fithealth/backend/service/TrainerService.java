package com.fithealth.backend.service;

import com.fithealth.backend.dto.Trainer.SelectTrainerDto;
import com.fithealth.backend.dto.Trainer.TrainerDetailDto;
import com.fithealth.backend.dto.Trainer.addTrainerDto;
import com.fithealth.backend.dto.Trainer.UpdateTrainerDto;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.io.IOException;

public interface TrainerService {
    String createTrainer(addTrainerDto.Request requestDto);
    Long registerTrainer(addTrainerDto.Create trainerDto, List<MultipartFile> files) throws IOException;
    List<SelectTrainerDto.Response> getAllTrainers();
    TrainerDetailDto.Response getTrainer(Long trainerNo);
    void updateTrainer(UpdateTrainerDto.Request requestDto);
    void patchTrainer(Long trainerNo, java.util.Map<String, Object> updates);
    TrainerDetailDto.ResponseRequest getTrainerRequest(Long trainerNo);
}
