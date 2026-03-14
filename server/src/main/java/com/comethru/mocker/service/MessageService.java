package com.comethru.mocker.service;

import com.comethru.mocker.entity.Message;
import com.comethru.mocker.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final SseService sseService;
    private final ExpoNotificationService expoNotificationService;

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public List<Message> getMessagesByRecipient(String to) {
        return messageRepository.findByTo(to);
    }

    public List<Message> getMessagesBySender(String from) {
        return messageRepository.findByFrom(from);
    }

    public List<Message> getMessagesBetween(String from, String to) {
        return messageRepository.findConversation(from, to).stream()
                .sorted(Comparator.comparing(Message::getSentAt))
                .toList();
    }

    public Message sendMessage(String from, String to, String body) {
        Message message = messageRepository.save(new Message(from, to, body));

        sseService.multicast(to, "message", message);
        if (!to.equals(from)) {
            sseService.multicast(from, "message", message);
        }

        expoNotificationService.notifyPhoneNumber(to, "New message from " + from, body);

        return message;
    }

    public boolean deleteMessage(Long id) {
        if (!messageRepository.existsById(id)) {
            return false;
        }
        messageRepository.deleteById(id);
        return true;
    }

    public List<ConversationSummary> getConversationsForPhoneNumber(String phoneNumber) {
        List<Message> relevantMessages = new ArrayList<>();
        relevantMessages.addAll(messageRepository.findByFrom(phoneNumber));
        relevantMessages.addAll(messageRepository.findByTo(phoneNumber));

        // Group by the other party
        Map<String, List<Message>> conversations = relevantMessages.stream()
                .collect(Collectors.groupingBy(m -> 
                        m.getFrom().equals(phoneNumber) ? m.getTo() : m.getFrom()
                ));

        // Build conversation summaries
        return conversations.entrySet().stream()
                .map(entry -> {
                    List<Message> messages = entry.getValue();
                    Message latestMessage = messages.stream()
                            .max(Comparator.comparing(Message::getSentAt))
                            .orElseThrow();
                    return new ConversationSummary(
                            entry.getKey(),
                            messages.size(),
                            latestMessage.getBody(),
                            latestMessage.getSentAt()
                    );
                })
                .sorted(Comparator.comparing(ConversationSummary::lastMessageAt).reversed())
                .toList();
    }

    public record ConversationSummary(
            String otherParty,
            int messageCount,
            String lastMessage,
            Instant lastMessageAt
    ) { }
}
