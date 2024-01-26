package com.applifi.generator.api.dto;

import lombok.Getter;
import lombok.Setter;

import static com.applifi.generator.api.resources.ResponseTypes.COVER_LETTER_GENERATED;

@Getter
@Setter
public class GeneratedCoverLetterResponse extends BaseResponse {
    private String coverLetter;
    private String jobId;


    public GeneratedCoverLetterResponse( String coverLetter, String jobId){
        this.coverLetter = coverLetter;
        this.jobId = jobId;
        super.setResponseType(COVER_LETTER_GENERATED);
    }
}