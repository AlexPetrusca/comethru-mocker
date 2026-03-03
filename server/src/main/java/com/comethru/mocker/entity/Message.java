package com.comethru.mocker.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "from_number")
    private String from;

    @Column(nullable = false, name = "to_number")
    private String to;

    @Column(nullable = false, length = 1600)
    private String body;

    @Column(nullable = false)
    private Instant sentAt;

    public Message() {
    }

    public Message(String from, String to, String body) {
        this.from = from;
        this.to = to;
        this.body = body;
        this.sentAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getFrom() {
        return from;
    }

    public String getTo() {
        return to;
    }

    public String getBody() {
        return body;
    }

    public Instant getSentAt() {
        return sentAt;
    }
}
