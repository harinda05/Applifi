package com.applifi.generator.api.utils;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;


public class OllamaCLient {

    public static void main(String[] args) {
        String resume = "Your resume content here";
        String jobDescription = "Your job description here";

        String response = OllamaCLient.callOllama(resume, jobDescription);
        System.out.println("Response from ChatGPT: " + response);
    }

    public static String callOllama(String resume, String jobDescription) {
        try {
            URL url = new URL("http://localhost:11434/api/generate");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json; utf-8");
            con.setRequestProperty("Accept", "application/json");
            con.setDoOutput(true);

            String customPrompt = "Write a customized cover letter for me using my resume";
            String prompt = String.format("%s\n\nResume:\n%s\n\nJob Description:\n%s", customPrompt, resume, jobDescription);

            JSONObject json = new JSONObject();
            json.put("model", "mistral");
            json.put("prompt", prompt);
            json.put("stream", false);

            String jsonInputString = json.toString();

            try (OutputStream os = con.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(con.getInputStream(), "utf-8"))) {
                StringBuilder response = new StringBuilder();
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }

                JSONObject jsonResponse = new JSONObject(response.toString());
                return jsonResponse.getString("response");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }


}
