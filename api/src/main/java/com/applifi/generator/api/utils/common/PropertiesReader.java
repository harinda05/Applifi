package com.applifi.generator.api.utils.common;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Properties;

@Slf4j
public class PropertiesReader extends ExternalConfigReader {

    private final Properties properties = new Properties();

    public PropertiesReader() {
        try {
            properties.load(this.getClass().getClassLoader().getResourceAsStream("service.properties"));
        } catch (IOException e) {
            log.error(e.getMessage());
        }
    }

    @Override
    public String getByKey(String key) {
        return properties.getProperty(key);
    }

}