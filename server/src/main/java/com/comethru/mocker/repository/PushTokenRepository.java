package com.comethru.mocker.repository;

import com.comethru.mocker.entity.PushToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PushTokenRepository extends JpaRepository<PushToken, UUID> {

    Optional<PushToken> findByToken(String token);

    List<PushToken> findAllByPhoneNumber(String phoneNumber);

    void deleteByToken(String token);
}
