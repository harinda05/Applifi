package com.applifi.generator.api.services;


import com.applifi.generator.api.dto.BaseResponse;
import com.applifi.generator.api.dto.GeneratedCoverLetterResponse;
import com.applifi.generator.api.models.GenerateCoverLetterModel;
import com.applifi.generator.api.utils.ChatGptClient;
import com.applifi.generator.api.utils.OllamaCLient;
import com.applifi.generator.api.utils.common.FileUtils;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;

import static com.applifi.generator.api.dto.ResponseTypes.REQUEST_QUEUED;

@Service
@Slf4j
public class GenerateCoverLetterService {
    private static final Gson gson = new Gson();

    public  String generateCoverLetter(GenerateCoverLetterModel generateCoverLetterModel){

        String resumeText = "";
        try {
            resumeText = FileUtils.extractTextFromPDF(generateCoverLetterModel.getResume());
        } catch (IOException e) {
            log.error(e.getMessage());
        }

        log.debug("Resume Text: {}", resumeText);

        if(generateCoverLetterModel.isUseChatGpt()){
            log.info("using gpt client to generate cover letter: session: {}, jobId: {}",generateCoverLetterModel.getSessionId(),generateCoverLetterModel.getJobId());
            runThreadGPT(generateCoverLetterModel.getSessionId(),generateCoverLetterModel.getDescription(),
                    generateCoverLetterModel.getJobId(), resumeText);
        } else {
            log.info("using ollama client to generate cover letter: session: {}, jobId: {}",generateCoverLetterModel.getSessionId(),generateCoverLetterModel.getJobId());
            runThreadMistral(generateCoverLetterModel.getSessionId(),generateCoverLetterModel.getDescription(),
                    generateCoverLetterModel.getJobId(), resumeText);
        }

        BaseResponse rsp_ack = new BaseResponse();
        rsp_ack.setResponseType(REQUEST_QUEUED);

        return gson.toJson(rsp_ack);
    }

    private void runThreadGPT(String sessionId, String jobDescription, String jobId, String resume){
        Thread gptThread = new Thread(() -> {
            String generatedText = ChatGptClient.callChatGpt(resume, jobDescription);
            log.info("cover letter generated for session: {}, jobId: {} ", sessionId, jobId);

            GeneratedCoverLetterResponse websocketResponse = new GeneratedCoverLetterResponse(generatedText, jobId);
            WebSocketHandlerService.send(sessionId, gson.toJson(websocketResponse));;

        });
        gptThread.start();
    }


    private void runThreadMistral(String sessionId, String jobDescription, String jobId, String resume){
        Thread ollamaThread = new Thread(() -> {
            String generatedText = OllamaCLient.callOllama(resume, jobDescription);
            GeneratedCoverLetterResponse websocketResponse = new GeneratedCoverLetterResponse(generatedText, jobId);
            WebSocketHandlerService.send(sessionId, gson.toJson(websocketResponse));;

        });
        ollamaThread.start();
    }
}
