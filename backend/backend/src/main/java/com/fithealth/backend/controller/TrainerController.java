package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Trainer.SelectTrainerDto;
import com.fithealth.backend.dto.Trainer.TrainerDetailDto;
import com.fithealth.backend.dto.Trainer.addTrainerDto;
import com.fithealth.backend.service.TrainerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.io.IOException;

@RestController
@RequestMapping("/api/trainer")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TrainerController {

    private final TrainerService trainerService;

    @PostMapping("/addTrainer")
    public ResponseEntity<String> addTrainer(@RequestBody addTrainerDto.Request requestDto) {
        return ResponseEntity.ok(trainerService.createTrainer(requestDto));
    }

    @PostMapping("/register")
    public ResponseEntity<Long> registerTrainer(
            @ModelAttribute addTrainerDto.Create trainerDto,
            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) throws IOException {
        return ResponseEntity.ok(trainerService.registerTrainer(trainerDto, files));
    }

    @GetMapping
    public ResponseEntity<List<SelectTrainerDto.Response>> getTrainerList() {
        List<SelectTrainerDto.Response> trainers = trainerService.getAllTrainers();
        return ResponseEntity.ok(trainers);
    }


    @GetMapping("/{trainerNo}")
    public ResponseEntity<TrainerDetailDto.Response> getTrainer(@PathVariable Long trainerNo) {
        System.out.println("컨트롤러가 받은 트레이너 번호 : " + trainerNo);
        TrainerDetailDto.Response trainerDetails = trainerService.getTrainer(trainerNo);
        return ResponseEntity.ok(trainerDetails);
    }
}


