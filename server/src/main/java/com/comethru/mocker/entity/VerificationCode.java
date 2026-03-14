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

    @Transient
    private int expirationMinutes;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        expiresAt = Instant.now().plusSeconds(expirationMinutes * 60L);
    }

    public VerificationCode(String to, String code, int expirationMinutes) {
        this.to = to;
        this.code = code;
        this.expirationMinutes = expirationMinutes;
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
}
