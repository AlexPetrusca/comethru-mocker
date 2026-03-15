package com.comethru.mocker.service;

import com.comethru.mocker.entity.VerificationCode;
import com.comethru.mocker.repository.VerificationCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VerificationCodeService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String VERIFICATION_SENDER = "777777";
    private static final int EXPIRATION_MINUTES = 10;

    private final VerificationCodeRepository verificationCodeRepository;
    private final MessageService messageService;
    private final ExpoNotificationService expoNotificationService;

    public VerificationCode sendVerificationCode(String to) {
        String code = generateCode();
        VerificationCode verificationCode = new VerificationCode(to, code, EXPIRATION_MINUTES);
        verificationCodeRepository.save(verificationCode);

        String messageBody = "Your ComeThru verification code is: " + code;
        messageService.sendMessage(VERIFICATION_SENDER, to, messageBody);

        expoNotificationService.notifyNewMessage(to, "Verification Code", messageBody, VERIFICATION_SENDER);

        return verificationCode;
    }

    public boolean verifyCode(String to, String code) {
        Optional<VerificationCode> latestCode = verificationCodeRepository.findFirstByToOrderByCreatedAtDesc(to);
        if (latestCode.isPresent() && latestCode.get().isValid(code)) {
            latestCode.get().markVerified();
            verificationCodeRepository.save(latestCode.get());
            return true;
        }
        return false;
    }

    public List<VerificationCode> getVerificationCodesByRecipient(String to) {
        return verificationCodeRepository.findByTo(to);
    }

    private String generateCode() {
        int code = RANDOM.nextInt(1_000_000);
        return String.format("%06d", code);
    }
}
