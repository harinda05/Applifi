package com.applifi.generator.api.dto;

import lombok.Getter;
import lombok.Setter;

import static com.applifi.generator.api.resources.ResponseTypes.MISSED_PERSISTENT_SESSION_ID;

@Getter
@Setter
public class MissingPersistentSessionIdResponse extends BaseResponse{
    private String persistentSessionId;

    public MissingPersistentSessionIdResponse(){
        super.setResponseType(MISSED_PERSISTENT_SESSION_ID);
    }

}
