package com.applifi.generator.api.utils;

import com.applifi.generator.api.utils.common.ConfigReaderFactory;
import com.applifi.generator.api.utils.common.ExternalConfigReader;
import com.theokanning.openai.completion.chat.ChatCompletionChoice;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;

import static com.applifi.generator.api.utils.common.ExternalConfigConst.OPEN_AI_API_KEY;

@Component
public class ChatGptClient {

    private static ExternalConfigReader configReader;

    @Autowired
    public ChatGptClient(ConfigReaderFactory configReaderFactory) {
        configReader = configReaderFactory.getConfigReader();
    }
    public static String callChatGpt(String resume, String jobDescription){

        String token = configReader.getByKey(OPEN_AI_API_KEY);
        OpenAiService service = new OpenAiService(token, Duration.ofSeconds(120));
        System.out.println("\nCreating completion...");
        ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest
            .builder()
            .model("gpt-3.5-turbo")
            .temperature(0.8)
            .n(1)
            .messages(
                List.of(
                    new ChatMessage("user", String.format("Write a customized cover letter for me using my resume: %s for the jobdescription: %s Max 1 page. Make sure to match my resume's content to match the job description. Avoid including un-necessary experiences or skills in the cover letter if that's not relevant to the job description. Make sure to customize, and sound natural not llm written", resume, jobDescription)))).build();
                    StringBuilder builder = new StringBuilder();
                    ChatCompletionChoice choice = service.createChatCompletion(chatCompletionRequest)
                      .getChoices().get(0);

                    builder.append(choice.getMessage().getContent());
            String rsp = builder.toString();
        System.out.println("rsp ===> "+   rsp);
        return rsp;
    }    
}
