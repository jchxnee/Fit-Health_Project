package com.fithealth.backend.repository;

import com.fithealth.backend.entity.Trainer;
import com.fithealth.backend.enums.CommonEnums;
import java.util.List;

public interface TrainerRepository {
    Long save(Trainer trainer);
    List<Trainer> getTop3(CommonEnums.Status status);
}
