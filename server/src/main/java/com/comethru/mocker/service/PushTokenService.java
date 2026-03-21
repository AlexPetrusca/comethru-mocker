package com.comethru.mocker.service;

import com.comethru.mocker.controller.NotificationController;
import com.comethru.mocker.entity.PushToken;
import com.comethru.mocker.repository.PushTokenRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PushTokenService {

    private final PushTokenRepository pushTokenRepository;

    public PushTokenService(PushTokenRepository pushTokenRepository) {
        this.pushTokenRepository = pushTokenRepository;
    }

    public void registerToken(NotificationController.PushTokenRequest request) {
        PushToken pushToken = pushTokenRepository.findByToken(request.token())
                .orElse(new PushToken());

        pushToken.setPhoneNumber(request.phoneNumber());
        pushToken.setToken(request.token());
        pushToken.setPlatform(request.platform());

        pushTokenRepository.save(pushToken);
    }

    public void deleteToken(String token) {
        pushTokenRepository.deleteByToken(token);
    }

    public List<PushToken> getTokensForPhoneNumber(String phoneNumber) {
        return pushTokenRepository.findAllByPhoneNumber(phoneNumber);
    }
}
