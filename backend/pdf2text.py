from PyPDF2 import PdfReader 

def preprocess_text(text:str)->str:
    return text

def get_text(filepath)->str: 
    
    reader = PdfReader(filepath) 
    
    # printing number of pages in pdf file 
    print(len(reader.pages)) 
    
    # getting a specific page from the pdf file 
    page = reader.pages[0] 
    
    # extracting text from page 
    text = page.extract_text() 
    return preprocess_text(text) 