package com.applifi.generator.api.dto;

import lombok.Getter;
import lombok.Setter;

import static com.applifi.generator.api.dto.ResponseTypes.KEEP_ALIVE_ACK;

@Getter
@Setter
public class KeepAliveResponse extends BaseResponse{
    private String keepAliveSessionId ;
    public KeepAliveResponse(){
        super.setResponseType(KEEP_ALIVE_ACK);
    }
}
