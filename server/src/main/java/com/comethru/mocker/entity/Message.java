package com.comethru.mocker.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor

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

    @PrePersist
    protected void onCreate() {
        sentAt = Instant.now();
    }

    public Message(String from, String to, String body) {
        this.from = from;
        this.to = to;
        this.body = body;
    }
}
