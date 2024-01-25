package com.applifi.generator.api.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
public class GenerateCoverLetterModel {
    String description;
    MultipartFile resume;
    String sessionId;
    String jobId;
    boolean useChatGpt;
}
