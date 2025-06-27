package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Trainer;
import java.util.List;

public interface TrainerRepository {
    Long save(Trainer trainer);
    List<Trainer> getTop3();
}
