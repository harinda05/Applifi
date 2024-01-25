package com.applifi.generator.api.utils.common;

import org.apache.commons.lang3.RandomStringUtils;

public class StringUtils {
    public static String getRandomString(int length){
        boolean useLetters = true;
        boolean useNumbers = false;
        return RandomStringUtils.random(length, useLetters, useNumbers);
    }
}
