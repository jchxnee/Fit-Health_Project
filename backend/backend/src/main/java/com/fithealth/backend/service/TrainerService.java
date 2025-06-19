package com.fithealth.backend.service;

import com.fithealth.backend.dto.Trainer.addTrainerDto;

public interface TrainerService {
    String createTrainer(addTrainerDto.Request requestDto);
}
