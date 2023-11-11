package com.applifi.sample.api.controllers;

import java.io.File;
import java.io.IOException;

import org.apache.tomcat.util.json.JSONParser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.applifi.sample.api.handlers.WebSocketHandler;
import com.applifi.sample.api.models.BaseResponse;
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
    public String generateCoverLetter(@RequestParam("description") String description, @RequestParam("resume") MultipartFile resume, @RequestParam("sessionId") String sessionId, @RequestParam("jobId") String jobId){


        ResponseClss rsp = new ResponseClss();

        rsp.setKeepAliveSessionId(sessionId);
        rsp.jobId = jobId;
        rsp.coverLetter = "This is a long coverLetter";
        rsp.setResponseType("cover_letter");

        mockThread(sessionId,rsp);

        System.out.println("file ==>" + resume.getName());
        ClassLoader classLoader = getClass().getClassLoader();
        String resourcePath = classLoader.getResource("").getPath();
 
        String uploadsPath = resourcePath + "uploads" + File.separator;
        File uploadsDirectory = new File(uploadsPath);
 
        if (!uploadsDirectory.exists()) {
            uploadsDirectory.mkdirs(); // Create the directory if it doesn't exist
        }
 
        String savePath = uploadsPath + resume.getOriginalFilename();
 
        try {
            resume.transferTo(new File(savePath));
            System.out.println("File uploaded successfully.");
        } catch (IOException e) {
            return "File upload failed: " + e.getMessage();
        }

        try {
            
            Object jsonObject = new JSONParser(description).parse(); // Parse the string back into an object
            String jsonRequestBody = gson.toJson(jsonObject); // Convert the object to a pretty-printed JSON string
            System.out.println(jsonRequestBody);
        } catch (Exception ex) {
            System.err.println("Error parsing JSON: " + ex.getMessage());
        }

        ResponseClss rsp_ack = new ResponseClss();
        rsp_ack.setResponseType("ack");
        String str = gson.toJson(rsp_ack);
        System.out.println(str);
        return str; 
    }

    private static void mockThread(String sessionId, ResponseClss responseClss){
        Thread one = new Thread() {
            public void run() {
                try {
                    System.out.println("Sleeping for 20");
        
                    Thread.sleep(20000);
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