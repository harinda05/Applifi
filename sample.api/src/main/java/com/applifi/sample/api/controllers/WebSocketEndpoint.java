package com.applifi.sample.api.controllers;

import java.io.IOException;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.multipart.MultipartFile;

import com.applifi.sample.api.models.Formdata;

@Controller("/websocket")
public class WebSocketEndpoint {

  @MessageMapping("/upload")
  public void onMessage(@Payload Formdata formData) throws IOException {
    String description = formData.getDescription();
        //MultipartFile resume = formData.getResume();

        // Perform necessary processing or save the data
        // Example: Print the received data
        System.out.println("Description: " + description);
        //System.out.println("Resume file name: " + resume.getOriginalFilename());
  }
}