package com.comethru.mocker.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "verification_codes")
public class VerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "to_number")
    private String to;

    @Column(nullable = false, length = 10)
    private String code;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    private boolean verified = false;

    public VerificationCode() {
    }

    public VerificationCode(String to, String code, int expirationMinutes) {
        this.to = to;
        this.code = code;
        this.createdAt = Instant.now();
        this.expiresAt = Instant.now().plusSeconds(expirationMinutes * 60L);
    }

    public boolean isExpired() {
        return Instant.now().isAfter(expiresAt);
    }

    public boolean isValid(String inputCode) {
        return !isExpired() && !verified && this.code.equals(inputCode);
    }

    public void markVerified() {
        this.verified = true;
    }

    public Long getId() {
        return id;
    }

    public String getTo() {
        return to;
    }

    public String getCode() {
        return code;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public boolean isVerified() {
        return verified;
    }
}
