package com.comethru.mocker.controller;

import com.comethru.mocker.service.SseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

@RestController
@RequestMapping("/sse")
public class SseController {

    private final SseService sseService;

    public SseController(SseService sseService) {
        this.sseService = sseService;
    }

    @GetMapping("/subscribe")
    public SseEmitter subscribe(@RequestParam String id) {
        return sseService.createEmitter(id);
    }

    @PostMapping("/debug")
    public ResponseEntity<Void> sendDebugEvent(
        @RequestParam String id,
        @RequestParam String type,
        @RequestBody(required = false) String data
    ) {
        sseService.multicast(id, "debug", Map.of(
            "type", type,
            "data", data != null ? data : "debug event",
            "timestamp", System.currentTimeMillis()
        ));
        return ResponseEntity.ok().build();
    }
}