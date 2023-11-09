import { RuntimeCommandType_PBP } from "../src/enum_store/linkedin_enums";
import { RunTimeMessage_PBP } from "../src/obj_store/msg_objs";
let generateBtn = document.getElementById("generateButton")
      import PouchDB from "pouchdb";


// chrome.runtime.onMessage.addListener((message: RunTimeMessage, sender, sendResponse)  => {
//     // Check if the message indicates to enable the button
//     console.log('activate generate btn event')

// });


if(generateBtn){
    generateBtn.addEventListener("click", function () {
        let generate_btn_clicked_message: RunTimeMessage_PBP = {
            type :RuntimeCommandType_PBP.generate_btn_click_event
        }
        chrome.runtime.sendMessage(generate_btn_clicked_message);
    });
}


// Get the file input element.
const fileInput = document.querySelector('#file-input') as HTMLInputElement;
const db = new PouchDB("my-pouchdb");

// Run the code when the popup opens.
window.addEventListener("load", async () => {

    //generate btn 
    let enable_generate_btn_message: RunTimeMessage_PBP = {
        type: RuntimeCommandType_PBP.request_enable_generate_event
    }
    
    chrome.runtime.sendMessage(enable_generate_btn_message, (response) => {
        // Handle the response from the background script, if needed
        console.log('Response from background:', JSON.stringify(response));
        if (generateBtn != null ) {
            if(response.type === RuntimeCommandType_PBP.enable_generate_event){
                generateBtn.removeAttribute('disabled'); // Enable the button
            } else if (response.type === RuntimeCommandType_PBP.disable_generate_event){
                generateBtn.setAttribute('disabled', 'true')
            }
        }
    });

    // ------------------

    console.log('checking for resume')
    let checkResumeExist: Boolean = false;
    
    // db.getAttachment("doc", "resume").then(function (blobOrBuffer) {
    //     console.log('resume exists')
    //     console.log(blobOrBuffer)  
    //     fileInput.setAttribute("disabled", "true");

    //     //----------------------------------------
    //     const file = new File([blobOrBuffer], "resume.pdf", {
    //         type: "application/pdf",
    //       });
          
    //       // Create a new URL object from the File object.
    //       const url = URL.createObjectURL(file);
          
    //       // Create a new anchor element and set its `href` attribute to the URL object.
    //       const anchorElement = document.createElement("a");
    //       anchorElement.href = url;
    //       anchorElement.textContent = "Download Resume";
    //       anchorElement.download = "resume_1.pdf";

    //       // Append the anchor element to the popup HTML.
    //       document.body.appendChild(anchorElement);

    // }).catch(function (err) {
    //     console.log('resume not found')
    //     console.log(err);
    // });
  });



if(fileInput){
    fileInput.addEventListener('change', () => {
        // Get the selected file.
        let file: any;
        if(fileInput.files != null){
            file = fileInput.files[0];

            db.put({
                _id: 'doc', 
                _attachments: {
                  "resume": {
                    content_type: file.type,
                    data: file
                  }
                }
              }).then((resp) => {
                console.log(resp)
              })
        } else {
            console.error('No Resume Selected')
        }
      });
}

  

