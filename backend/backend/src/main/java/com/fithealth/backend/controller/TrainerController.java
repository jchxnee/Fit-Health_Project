package com.fithealth.backend.controller;

import com.fithealth.backend.entity.Trainer;
import com.fithealth.backend.service.TrainerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/trainer")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TrainerController {

    private final TrainerService trainerService;


}
