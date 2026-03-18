package com.comethru.mocker.controller;

import com.comethru.mocker.entity.Message;
import com.comethru.mocker.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody SendMessageRequest request) {
        Message message = messageService.sendMessageAndNotify(request.from(), request.to(), request.body());
        return ResponseEntity.created(URI.create("/messages/" + message.getId())).body(message);
    }

    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages() {
        return ResponseEntity.ok(messageService.getAllMessages());
    }

    @GetMapping("/recipient/{to}")
    public ResponseEntity<List<Message>> getMessagesByRecipient(@PathVariable String to) {
        return ResponseEntity.ok(messageService.getMessagesByRecipient(to));
    }

    @GetMapping("/sender/{from}")
    public ResponseEntity<List<Message>> getMessagesBySender(@PathVariable String from) {
        return ResponseEntity.ok(messageService.getMessagesBySender(from));
    }

    @GetMapping("/between")
    public ResponseEntity<List<Message>> getMessagesBetween(
            @RequestParam String from,
            @RequestParam String to
    ) {
        return ResponseEntity.ok(messageService.getMessagesBetween(from, to));
    }

    @GetMapping("/conversations/{phoneNumber}")
    public ResponseEntity<List<MessageService.ConversationSummary>> getConversations(@PathVariable String phoneNumber) {
        return ResponseEntity.ok(messageService.getConversationsForPhoneNumber(phoneNumber));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        if (!messageService.deleteMessage(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    public record SendMessageRequest(String from, String to, String body) {
    }
}
