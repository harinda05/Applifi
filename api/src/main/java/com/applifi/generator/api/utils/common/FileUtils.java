package com.applifi.generator.api.utils.common;

import java.io.File;
import java.io.IOException;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.AccessPermission;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
public class FileUtils {
    public static String extractTextFromPDF(MultipartFile resume) throws IOException {

        File file = FileUtils.multipartToFile(resume, resume.getOriginalFilename());
        StringBuilder stringBuilder = new StringBuilder();

        // Extract Text from PDF File
        try (PDDocument document = PDDocument.load(file)) {
            final AccessPermission ap = document.getCurrentAccessPermission();
            if (!ap.canExtractContent()) {
                throw new IOException("You do not have permission to extract text");
            }
 
            final PDFTextStripper stripper = new PDFTextStripper();

            for (int p = 1; p <= document.getNumberOfPages(); ++p) {
                // extracted.
                stripper.setStartPage(p);
                stripper.setEndPage(p);
                final String text = stripper.getText(document);
                stringBuilder.append(text);
            }

        }catch (Exception e) {
            log.error(e.getMessage());
        }

        return stringBuilder.toString();
    }

    private static File multipartToFile(MultipartFile multipart, String fileName) throws IllegalStateException, IOException {
        File convFile = new File(System.getProperty("java.io.tmpdir")+"/"+fileName);
        multipart.transferTo(convFile);
        return convFile;
    }
}