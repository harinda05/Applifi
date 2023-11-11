package com.applifi.sample.api.handlers;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.messaging.MessagingException;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.applifi.sample.api.models.BaseResponse;
import com.google.gson.Gson;


public class WebSocketHandler extends TextWebSocketHandler {

    private static Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    // Process the message and send a response if needed
  
@Override
public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) {
    // Handle incoming messages here
    String receivedMessage = (String) message.getPayload();

    BaseResponse keepAliveResponse = new BaseResponse();
    keepAliveResponse.setKeepAliveSessionId(session.getId());
    keepAliveResponse.setResponseType("ws_ack");
    Gson gson = new Gson();

    try {
        session.sendMessage(new TextMessage(gson.toJson(keepAliveResponse)));

    } catch (IOException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
    }
}

@Override
public void afterConnectionEstablished(WebSocketSession session) throws IOException {
    sessions.put(session.getId(), session);
    BaseResponse keepAliveResponse = new BaseResponse();
    keepAliveResponse.setKeepAliveSessionId(session.getId());    
    
    Gson gson = new Gson();

    session.sendMessage(new TextMessage(gson.toJson(keepAliveResponse)));
    System.out.println("new connection est: " + session.getId());
}

@Override
public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
    sessions.remove(session.getId());
    System.out.println("connection cls: " + session.getId());
}

public static void send(String session_id, String msg) throws MessagingException {
    System.out.println("sessionId "+session_id);
    WebSocketSession session = sessions.get(session_id);
    if(session != null){
        try {
                session.sendMessage (new TextMessage(msg));
            } catch (IOException ex) {
                throw new MessagingException(ex.getMessage());
            }
    } else {
        System.out.println("session is null");
    }
}
}