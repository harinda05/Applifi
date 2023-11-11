package com.applifi.sample.api.models;

import org.springframework.web.multipart.MultipartFile;

public class Formdata {
    private String description;
    private MultipartFile resume;
    private String keepAlive;
    
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public MultipartFile getResume() {
        return resume;
    }
    public void setResume(MultipartFile resume) {
        this.resume = resume;
    }
    public String getKeepAlive() {
        return keepAlive;
    }
    public void setKeepAlive(String keepAlive) {
        this.keepAlive = keepAlive;
    }

    // getters and setters

    // Add any other fields if needed
}