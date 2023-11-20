package com.applifi.sample.api.controllers;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

import org.apache.tomcat.util.json.JSONParser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.applifi.sample.api.handlers.WebSocketHandler;
import com.applifi.sample.api.models.BaseResponse;
import com.applifi.sample.api.utils.ChatGptClient;
import com.applifi.sample.api.utils.common.FileUtils;
import com.google.gson.Gson;

@RestController
public class SampleService {
    static final Gson gson = new Gson();

    private class ResponseClss extends BaseResponse{
        String coverLetter;
        String jobId;
    }

    @GetMapping("/")
	public String message() {
		return "This is a test cover letter";
	}

    @PostMapping("/generate-cover-letter")
    public String generateCoverLetter(@RequestParam("description") String description, @RequestParam("resume") MultipartFile resume, @RequestParam("sessionId") String sessionId, @RequestParam("jobId") String jobId,  @RequestParam("useChatGpt") boolean useChatGpt){


        ResponseClss rsp = new ResponseClss();

        rsp.setKeepAliveSessionId(sessionId);
        rsp.jobId = jobId;
        rsp.coverLetter = "";
        rsp.setResponseType("cover_letter");

        String resumeString = "";        
        try {
            File resumeFile = FileUtils.multipartToFile(resume, resume.getOriginalFilename());
            resumeString = FileUtils.extractTextFromPDF(resumeFile);
        } catch (IllegalStateException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        System.out.println(resumeString);


        if(useChatGpt){
            System.out.println("Using ChatGPT");
            mockThreadGPT(sessionId,rsp, resumeString, description);
        } else {
            /*** Ayush & Pritom Please Implement This */
        }

        ResponseClss rsp_ack = new ResponseClss();
        rsp_ack.setResponseType("ack");
        String str = gson.toJson(rsp_ack);
        System.out.println(str);
        return str; 
    }

    private static void mockThreadGPT(String sessionId, ResponseClss responseClss, String resume, String jobDescription){
        Thread one = new Thread() {
            public void run() {
                try {
                    String s = ChatGptClient.callChatGpt(resume, jobDescription);
        
                    Thread.sleep(20000);

                    responseClss.coverLetter = s;
                    //WebSocketHandler.send(sessionId, gson.toJson(responseClss));;
                    WebSocketHandler.send(sessionId, gson.toJson(responseClss));;

                    System.out.println("Contine");
                } catch(InterruptedException v) {
                    System.out.println(v);
                }
            }  
        };
        
        one.start();
    }

}