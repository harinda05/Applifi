package com.applifi.generator.api.controllers;

import com.applifi.generator.api.models.GenerateCoverLetterModel;
import com.applifi.generator.api.services.GenerateCoverLetterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("")
@Slf4j
public class CoverLetterGeneratorController {

    GenerateCoverLetterService generateCoverLetterService = new GenerateCoverLetterService();

    @PostMapping("/generate-cover-letter")
    public String generateCoverLetter(@RequestParam("description") String description, @RequestParam("resume") MultipartFile resume, @RequestParam("sessionId") String sessionId, @RequestParam("jobId") String jobId,  @RequestParam("useChatGpt") boolean useChatGpt){
        return generateCoverLetterService.generateCoverLetter(
                new GenerateCoverLetterModel(description,
                resume,sessionId,jobId,useChatGpt));
    }

}