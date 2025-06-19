package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Trainer.addTrainerDto;
import com.fithealth.backend.service.TrainerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/trainer")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5176")
public class TrainerController {

    private final TrainerService trainerService;


    @PostMapping
    public ResponseEntity<String> addTrainer(@RequestBody addTrainerDto addTrainerDto) {
        return ResponseEntity.ok(TrainerService.createTrainer(addTrainerDto));
    }
}
