package com.applifi.generator.api.utils.common;


import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@NoArgsConstructor
public class ConfigReaderFactory {
    @Value("${application.external.config.source}")
    private String configSource;
    public ExternalConfigReader getConfigReader() {
        if (configSource.equalsIgnoreCase("external-property-file")) {
            return new PropertiesReader();
        }
        // Handle other config sources here: ex: mysql, json , yaml
        return null;
    }
}
