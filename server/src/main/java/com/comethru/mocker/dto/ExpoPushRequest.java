package com.comethru.mocker.dto;

import java.util.Map;

public record ExpoPushRequest(
    String to,
    String title,
    String body,
    Map<String, String> data
) {
    public static ExpoPushRequest conversation(String token, String title, String body, String from, String to) {
        Map<String, String> payload = Map.of(
            "type", "conversation",
            "from", from != null ? from : "",
            "to", to != null ? to : ""
        );
        return new ExpoPushRequest(token, title, body, payload);
    }

    public static ExpoPushRequest debug(String token, String title, String body) {
        Map<String, String> payload = Map.of(
            "type", "debug"
        );
        return new ExpoPushRequest(token, title, body, payload);
    }
}
