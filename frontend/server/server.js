const express = require('express');
var app = express();
const multer = require('multer');
const fs = require('fs');
const pdfParser = require('pdf-parse');

// Set up the file upload using multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'uploads/'); // Define the destination folder for uploaded files
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname); // Define the file name
    },
});
  
const upload = multer({ storage });

app.post("/upload", upload.single('pdfFile'), (req, res) => {
    const uploadedFile = req.file;
  
    if (!uploadedFile) {
        res.status(400).send('No file uploaded.');
    } else {
        console.log("File uploaded successfully!");
         // Read the pdf file and parse it
        const dataBuffer = fs.readFileSync(uploadedFile.path);
        pdfParser(dataBuffer).then(data => 
            console.log(data)
        ).catch(error => 
            console.log(error)
        );
        res.send('File uploaded successfully: ' + uploadedFile.originalname);
    }
});

app.listen(3000, function(){
    console.log("Server running on port 3000");
});