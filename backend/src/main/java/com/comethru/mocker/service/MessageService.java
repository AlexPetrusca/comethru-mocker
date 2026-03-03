package com.comethru.mocker.service;

import com.comethru.mocker.entity.Message;
import com.comethru.mocker.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Message sendMessage(String from, String to, String body) {
        Message message = new Message(from, to, body);
        return messageRepository.save(message);
    }

    public List<Message> getMessagesByRecipient(String to) {
        return messageRepository.findByTo(to);
    }

    public List<Message> getMessagesBySender(String from) {
        return messageRepository.findByFrom(from);
    }

    public List<Message> getMessagesBetween(String from, String to) {
        return messageRepository.findByFromAndTo(from, to);
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public boolean deleteMessage(Long id) {
        if (!messageRepository.existsById(id)) {
            return false;
        }
        messageRepository.deleteById(id);
        return true;
    }
}
