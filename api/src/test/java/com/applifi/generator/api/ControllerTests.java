package com.applifi.generator.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ControllerTests {

    @Autowired
    MockMvc mockMvc;
    @Test
    public void testPostEndpoint() throws Exception {
        MockMultipartFile file = new MockMultipartFile("resume", "file.pdf", MediaType.TEXT_PLAIN_VALUE, "Hello, World!".getBytes());

        MvcResult res = mockMvc.perform(MockMvcRequestBuilders.multipart("/generate-cover-letter")
                        .file(file)
                        .param("description", "test_description")
                        .param("sessionId", "test")
                        .param("jobId", "test")
                        .param("useChatGpt", "false"))
                .andExpect(status().isOk())
                .andReturn();

        System.out.println(res.getResponse());

    }

}
