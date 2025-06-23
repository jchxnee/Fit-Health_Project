package com.fithealth.backend.controller;

import com.fithealth.backend.dto.Trainer.SelectTrainerDto;
import com.fithealth.backend.dto.Trainer.TrainerDetailDto;
import com.fithealth.backend.dto.Trainer.addTrainerDto;
import com.fithealth.backend.dto.Trainer.UpdateTrainerDto;
import com.fithealth.backend.service.TrainerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.io.IOException;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
import java.io.File;

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

    @PutMapping("/{trainerNo}")
    public ResponseEntity<Void> updateTrainer(@PathVariable Long trainerNo, @RequestBody UpdateTrainerDto.Request requestDto) {
        // trainerNo가 일치하는지 검증
        if (!trainerNo.equals(requestDto.getTrainerNo())) {
            return ResponseEntity.badRequest().build();
        }
        trainerService.updateTrainer(requestDto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{trainerNo}")
    public ResponseEntity<Void> patchTrainer(@PathVariable Long trainerNo, @RequestBody Map<String, Object> updates) {
        trainerService.patchTrainer(trainerNo, updates);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/uploadPhoto")
    public ResponseEntity<Map<String, String>> uploadPhoto(@RequestParam("file") MultipartFile file) throws IOException {
        String UPLOAD_PATH = "E:\\test";
        String originName = file.getOriginalFilename();
        String changeName = UUID.randomUUID().toString() + "_" + originName;
        File uploadDir = new File(UPLOAD_PATH);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        file.transferTo(new File(UPLOAD_PATH + File.separator + changeName));
        Map<String, String> result = new HashMap<>();
        result.put("originName", originName);
        result.put("changeName", changeName);
        return ResponseEntity.ok(result);
    }
}


