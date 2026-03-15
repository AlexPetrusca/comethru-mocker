package com.comethru.mocker.controller;

import com.comethru.mocker.service.PushTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/push-tokens")
@RequiredArgsConstructor
public class PushTokenController {

    private final PushTokenService pushTokenService;

    @PostMapping
    public ResponseEntity<Void> register(@RequestBody PushTokenRequest request) {
        pushTokenService.registerToken(request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{token}")
    public ResponseEntity<Void> unregister(@PathVariable String token) {
        pushTokenService.deleteToken(token);
        return ResponseEntity.ok().build();
    }

    public record PushTokenRequest(String phoneNumber, String token, String platform) { }
}
