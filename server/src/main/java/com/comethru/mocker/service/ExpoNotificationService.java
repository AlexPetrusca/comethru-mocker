package com.comethru.mocker.service;

import com.comethru.mocker.dto.ExpoPushRequest;
import com.comethru.mocker.entity.PushToken;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpoNotificationService {

    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
    private final PushTokenService pushTokenService;
    private final WebClient webClient = WebClient.create();

    public void notifyNewMessage(String to, String title, String body, String from) {
        List<PushToken> tokens = pushTokenService.getTokensForPhoneNumber(to);
        System.out.println("[PUSH] Send to: " + tokens);

        List<ExpoPushRequest> messages = tokens.stream()
                .map(token -> ExpoPushRequest.conversation(token.getToken(), title, body, from, to))
                .toList();

        if (messages.isEmpty()) return;

        webClient.post()
                .uri(EXPO_PUSH_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(messages)
                .retrieve()
                .bodyToMono(String.class)
                .doOnNext(response -> System.out.println("[PUSH] Expo response: " + response))
                .doOnError(error -> System.out.println("[PUSH] Expo error: " + error.getMessage()))
                .subscribe(
                        response -> handleReceipts(response, tokens),
                        error -> System.err.println("Failed to send push notification: " + error.getMessage())
                );
    }

    private void handleReceipts(String response, List<PushToken> tokens) {
        // If Expo returns DeviceNotRegistered, delete the stale token
        if (response.contains("DeviceNotRegistered")) {
            tokens.forEach(token -> pushTokenService.deleteToken(token.getToken()));
        }
    }
}
