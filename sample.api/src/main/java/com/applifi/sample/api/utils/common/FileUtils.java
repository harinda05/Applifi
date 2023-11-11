package com.applifi.sample.api.utils.common;

import java.io.File;
import java.io.IOException;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.AccessPermission;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.web.multipart.MultipartFile;

public class FileUtils {

    public  static File multipartToFile(MultipartFile multipart, String fileName) throws IllegalStateException, IOException {
        File convFile = new File(System.getProperty("java.io.tmpdir")+"/"+fileName);
        multipart.transferTo(convFile);
        return convFile;
    }
 
    public static String extractTextFromPDF(File file) throws IOException {

        StringBuffer stringBuffer = new StringBuffer();

 
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
 
                // let the magic happen
                final String text = stripper.getText(document);
                stringBuffer.append(text);
            }


        }catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
        }

        return stringBuffer.toString();
    }
}