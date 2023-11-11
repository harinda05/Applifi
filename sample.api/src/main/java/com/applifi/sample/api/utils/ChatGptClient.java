package com.applifi.sample.api.utils;

import com.theokanning.openai.completion.CompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionChoice;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;

import java.time.Duration;
import java.util.List;



public class ChatGptClient {

    public static void main(String[] args){
        callChatGpt("test", "test");
    }

    public static String callChatGpt(String resume, String jobDescription){

        String token = "XXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // your chatgpt token here
        OpenAiService service = new OpenAiService(token, Duration.ofSeconds(120));
        System.out.println("\nCreating completion...");
        ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest
            .builder()
            .model("gpt-3.5-turbo")
            .temperature(0.8)
            .n(1)
            .messages(
                List.of(
                    new ChatMessage("user", String.format("Write a customized cover letter for me using my resume: %s for the jobdescription: %s Max 1 page", resume, jobDescription)))).build();
                    StringBuilder builder = new StringBuilder();
                    ChatCompletionChoice choice = service.createChatCompletion(chatCompletionRequest)
                      .getChoices().get(0);

                    builder.append(choice.getMessage().getContent());
            chatCompletionRequest.setN(null);        
            String rsp = builder.toString();        
        System.out.println("rsp ===> "+   rsp);
        return rsp;
    }    
}
