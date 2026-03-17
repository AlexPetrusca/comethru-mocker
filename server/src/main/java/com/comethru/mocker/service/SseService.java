package com.comethru.mocker.service;

import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseService {

    private final Map<String, List<SseEmitter>> emitters;

    public SseService() {
        emitters = new ConcurrentHashMap<>();
    }

    public SseEmitter createEmitter(String id) {
        SseEmitter emitter = new SseEmitter(0L);
        try {
            emitter.send(SseEmitter.event().comment("heartbeat"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        // Add to the list for this ID (create the list if it doesn't exist yet)
        emitters.computeIfAbsent(id, k -> new CopyOnWriteArrayList<>()).add(emitter);

        Runnable cleanup = () -> {
            List<SseEmitter> list = emitters.get(id);
            if (list != null) {
                list.remove(emitter);
                if (list.isEmpty()) emitters.remove(id); // clean up empty lists
            }
        };

        emitter.onCompletion(cleanup);
        emitter.onTimeout(cleanup);
        emitter.onError(e -> cleanup.run());

        return emitter;
    }

    public void multicast(String id, String eventName, Object data) {
        System.out.println("[SSE] Send to " + id);
        emitters.forEach((eId, list) -> {
            if (id.equals(eId)) {
                list.forEach(emitter -> {
                    try {
                        emitter.send(SseEmitter.event()
                                .name(eventName)
                                .data(data, MediaType.APPLICATION_JSON));
                    } catch (Exception e) {
                        list.remove(emitter);
                    }
                });
            }
        });
    }

    public void broadcast(String eventName, Object data) {
        emitters.forEach((id, list) -> {
            list.forEach(emitter -> {
                try {
                    emitter.send(SseEmitter.event()
                            .name(eventName)
                            .data(data, MediaType.APPLICATION_JSON));
                } catch (IOException e) {
                    list.remove(emitter);
                }
            });
        });
    }

    @Scheduled(fixedRate = 30000)
    public void sendHeartbeat() {
        emitters.forEach((id, list) -> {
            list.forEach(emitter -> {
                try {
                    emitter.send(SseEmitter.event().comment("heartbeat"));
                } catch (IOException e) {
                    list.remove(emitter);
                }
            });
        });
    }
}