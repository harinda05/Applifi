package com.applifi.generator.api;

import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

import static com.applifi.generator.api.utils.common.FileUtils.extractTextFromPDF;
import static com.applifi.generator.api.utils.common.StringUtils.getRandomString;
import org.apache.pdfbox.pdmodel.*;

@SpringBootTest
class UtilTests {

	@Test
	void testGetRandomString() {
		int length = 10;
		String randomString = getRandomString(10);
		Assertions.assertEquals(length, randomString.length());
	}


	@Test
	void testExtractTextFromPDF() throws IOException {

		String originalFilename = "file123.pdf";
		String contentType = "application/pdf";
		String content = "This is a pdf file content";
		File pdfFile;

		try {
			 pdfFile = createMockPdfData(content, originalFilename);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		byte[] pdfData = Files.readAllBytes(pdfFile.toPath());

		MultipartFile multipartFile = new MockMultipartFile(
				originalFilename,
				originalFilename,
				contentType,
				pdfData
		);

		String fileContent;
		try {
			fileContent = extractTextFromPDF(multipartFile);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		Assertions.assertEquals((content+"\r\n"), fileContent); // MockMultipartFile adds \r\n lines to content

	}

	private File createMockPdfData(String content, String filename) throws Exception {
		PDDocument document = new PDDocument();

		// Add a new page
		PDPage page = new PDPage();
		document.addPage(page);

		// Get a content stream for the page
		try(PDPageContentStream contentStream = new PDPageContentStream(document, page)){
			contentStream.beginText();
			contentStream.setFont(PDType1Font.HELVETICA, 12);
			contentStream.showText(content);
			contentStream.endText();
			contentStream.close();
			// Save the document
			document.save("./src/test/"+ filename);
		} catch (Exception e){
			throw new Exception(e);
		}
		return new File(filename);
	}

}
