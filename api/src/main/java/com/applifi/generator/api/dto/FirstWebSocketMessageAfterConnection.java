package com.applifi.generator.api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FirstWebSocketMessageAfterConnection extends WebSocketMessageIncomingRequest {
    private String persistentSessionId;
}
