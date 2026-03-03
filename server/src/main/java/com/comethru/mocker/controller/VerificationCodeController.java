package com.comethru.mocker.controller;

import com.comethru.mocker.entity.VerificationCode;
import com.comethru.mocker.service.VerificationCodeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/verification")
public class VerificationCodeController {

    private final VerificationCodeService verificationCodeService;

    public VerificationCodeController(VerificationCodeService verificationCodeService) {
        this.verificationCodeService = verificationCodeService;
    }

    @PostMapping("/send")
    public ResponseEntity<VerificationCodeResponse> sendVerificationCode(@RequestBody SendVerificationRequest request) {
        VerificationCode verificationCode = verificationCodeService.sendVerificationCode(request.to());
        return ResponseEntity.ok(new VerificationCodeResponse("Verification code sent", verificationCode.getTo()));
    }

    @PostMapping("/verify")
    public ResponseEntity<VerificationResultResponse> verifyCode(@RequestBody VerifyCodeRequest request) {
        boolean valid = verificationCodeService.verifyCode(request.to(), request.code());
        return ResponseEntity.ok(new VerificationResultResponse(valid, valid ? "Code verified successfully" : "Invalid or expired code"));
    }

    @GetMapping("/recipient/{to}")
    public ResponseEntity<List<VerificationCode>> getVerificationCodesByRecipient(@PathVariable String to) {
        return ResponseEntity.ok(verificationCodeService.getVerificationCodesByRecipient(to));
    }

    public record SendVerificationRequest(String to) { }

    public record VerifyCodeRequest(String to, String code) { }

    public record VerificationCodeResponse(String message, String to) { }

    public record VerificationResultResponse(boolean valid, String message) { }
}
