package com.applifi.generator.api.controllers;

import com.applifi.generator.api.dto.KeepAliveResponse;
import com.applifi.generator.api.dto.MissingPersistentSessionIdResponse;
import com.applifi.generator.api.resources.WebSocketMessageincomingConst;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static com.applifi.generator.api.utils.common.StringUtils.getRandomString;

@Slf4j
@Controller
public class WebSocketHandlerController extends TextWebSocketHandler {
    private final Gson gson = new Gson();
    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void handleMessage(@NotNull WebSocketSession session, WebSocketMessage<?> message) {
        JsonObject receivedMessage = (JsonObject) JsonParser.parseString(message.getPayload().toString());

        if (receivedMessage.get("msgType").getAsString().equals(WebSocketMessageincomingConst.FIRST_MESSAGE_AFTER_CONNECTION_INIT)) {
            String persistentSessionId = receivedMessage.get("persistentSessionId").getAsString();

            // Already existing user
            if (persistentSessionId != null && !persistentSessionId.isEmpty()) {
                sessions.put(persistentSessionId, session);
            }

            // New user
            else {
                // Generate new persistent session id and send to user - Don't put to the session map yet
                persistentSessionId = getRandomString(15);
                MissingPersistentSessionIdResponse missingPersistentSessionIdResponse = new MissingPersistentSessionIdResponse();
                missingPersistentSessionIdResponse.setPersistentSessionId(persistentSessionId);
                try {
                    session.sendMessage(new TextMessage(gson.toJson(missingPersistentSessionIdResponse)));
                    sessions.put(persistentSessionId, session);
                    log.info("persistentSessionId {} added to session map", persistentSessionId);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }

        } else if (receivedMessage.get("msgType").getAsString().equals(WebSocketMessageincomingConst.KEEP_ALIVE)) {
            KeepAliveResponse resp = new KeepAliveResponse();
            resp.setKeepAliveSessionId(session.getId());
            try {
                session.sendMessage(new TextMessage(gson.toJson(resp)));
            } catch (IOException e) {
                log.error(e.getMessage());
            }
        }

    }

    //sessions.put(persistentSessionId, session);
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("new connection est: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, @NotNull CloseStatus status) {
        //sessions.remove(session.getId());
        log.info("connection close session removed: " + session.getId());
    }

    public static void send(String session_id, String msg) throws MessagingException {
        log.info("Sending websocket message {} to msg sessionId {} ", msg, session_id);
        WebSocketSession session = sessions.get(session_id);
        if (session != null) {
            try {
                session.sendMessage(new TextMessage(msg));
            } catch (IOException ex) {
                throw new MessagingException(ex.getMessage());
            }
        } else {
            log.error("session is not found");
        }
    }
}