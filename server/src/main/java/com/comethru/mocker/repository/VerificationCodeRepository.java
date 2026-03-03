package com.comethru.mocker.repository;

import com.comethru.mocker.entity.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {

    List<VerificationCode> findByTo(String to);

    Optional<VerificationCode> findFirstByToOrderByCreatedAtDesc(String to);
}
