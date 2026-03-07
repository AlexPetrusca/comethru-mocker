package com.comethru.mocker.controller;

import com.comethru.mocker.service.SseService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

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

//    // Endpoint to push events to a specific client
//    @PostMapping("/send/{id}")
//    public ResponseEntity<Void> sendEvent(@PathVariable String id,
//                                          @RequestBody String message) {
//        sseService.multicast(id, message);
//        return ResponseEntity.ok().build();
//    }
}