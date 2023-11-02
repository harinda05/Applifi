// Get references to the HTML elements
const uploadForm = document.getElementById('uploadForm');
const textArea = document.getElementById('textArea');
const fileInput = document.getElementById('fileInput');
const analysisResult = document.getElementById('analysisResult');

// Event listener for form submission
uploadForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get the text from the text area
    const text = textArea.value;

    // Get the uploaded PDF file
    const pdfFile = fileInput.files[0];

    // For now, let's log the data to the console as an example:
    console.log('Pasted Text:', text);
    console.log('Uploaded PDF File:', pdfFile);

    // Create empty formData object and append data to it
    const formData = new FormData();
    formData.append('pdfFile', pdfFile);

    // Post data to Node and Express server:
    const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData, // Payload is formData object
    })

    // Get the response from the server
    if (response.ok) {
        const result = await response.json();
        analysisResult.textContent = result;
    } else {
        analysisResult.textContent = 'Error: ' + response.status;
    };
});