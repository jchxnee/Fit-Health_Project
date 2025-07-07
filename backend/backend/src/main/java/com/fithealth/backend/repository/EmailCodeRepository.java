package com.fithealth.backend.repository;

import com.fithealth.backend.entity.EmailCode;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailCodeRepository extends JpaRepository<EmailCode, String> {
    Optional<EmailCode> findByEmail(String email);
}
