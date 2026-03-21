package com.comethru.mocker.controller;

import com.comethru.mocker.service.ExpoNotificationService;
import com.comethru.mocker.service.PushTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final ExpoNotificationService expoNotificationService;
    private final PushTokenService pushTokenService;

    @PostMapping("/debug")
    public ResponseEntity<Void> sendDebugNotification(
        @RequestParam String phoneNumber,
        @RequestParam String title,
        @RequestParam(required = false, defaultValue = "This is a debug notification") String body
    ) {
        expoNotificationService.sendDebugNotification(phoneNumber, title, body);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/push-tokens")
    public ResponseEntity<Void> register(@RequestBody PushTokenRequest request) {
        pushTokenService.registerToken(request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/push-tokens/{token}")
    public ResponseEntity<Void> unregister(@PathVariable String token) {
        pushTokenService.deleteToken(token);
        return ResponseEntity.ok().build();
    }

    public record PushTokenRequest(String phoneNumber, String token, String platform) {}
}
