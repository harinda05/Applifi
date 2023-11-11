package com.applifi.sample.api.models;

public class BaseResponse {

    private String keepAliveSessionId ;
    private String responseType;

    public String getKeepAliveSessionId() {
        return keepAliveSessionId;
    }

    public void setKeepAliveSessionId(String keepAliveSessionId) {
        this.keepAliveSessionId = keepAliveSessionId;
    }

    public String getResponseType() {
        return responseType;
    }

    public void setResponseType(String responseType) {
        this.responseType = responseType;
    }
    
}
