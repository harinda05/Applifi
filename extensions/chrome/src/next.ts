import { RuntimeCommandType_PBP } from "../src/enum_store/linkedin_enums";
import { RunTimeMessage_PBP, pendingJob } from "../src/obj_store/msg_objs";
let generateBtn = document.getElementById("generateButton")
      import PouchDB from "pouchdb";
      import PouchDBFind  from 'pouchdb-find';
      PouchDB.plugin(PouchDBFind );

      // Get the file input element.
const fileInput = document.querySelector('#file-input') as HTMLInputElement;
const db = new PouchDB("my-pouchdb");
const state_db = new PouchDB("state-db")

chrome.runtime.onMessage.addListener((message: RunTimeMessage_PBP, sender) => {
    console.info(":::::::::::::::::::::::::: message Received :::::::::::::: + \n" + JSON.stringify(message))
    if(message.type === RuntimeCommandType_PBP.alert_coverletter_complete){
        
        editResultItemWhenComplete(message.content.uId)

        // in a diff workflow
        db.get(message.content.uId).then(function (doc) {
            console.log("cover lettterrr ++++++++++++++  : " + JSON.stringify(doc))
           
          }).catch(function (err) {
            console.log(err);
          });
    }
})

if(generateBtn){
    generateBtn.addEventListener("click", function () {

        let uId = Date.now() + getRandomInt(99999)
        let generate_btn_clicked_message: RunTimeMessage_PBP = {
            type :RuntimeCommandType_PBP.generate_btn_click_event,
            content: {
                uId : uId
            }
        }
        chrome.runtime.sendMessage(generate_btn_clicked_message, (response: pendingJob) => {
            console.log("receivedResponse_fromBackground: " + response)

            addPendingJobToPopup(response.uId, response.title, false)
        });
    });
}

function addPendingJobToPopup (uId: number, title: string, fromDbFlag: boolean){
        const generatedResultsDiv = document.querySelector('.generated-results');
        const resultItemDiv = document.createElement('div');
        resultItemDiv.classList.add('result-item');
        resultItemDiv.id = String(uId)

        const paragraphElement = document.createElement('p');
        paragraphElement.textContent = title;

        const anchorElement = document.createElement('a');
        anchorElement.href = '#';
        anchorElement.textContent = 'Pending';

        resultItemDiv.appendChild(paragraphElement);
        resultItemDiv.appendChild(anchorElement);

        if(generatedResultsDiv){
            generatedResultsDiv.appendChild(resultItemDiv);}

        //persist for popup reload ---------- refactor

        if(!fromDbFlag){
            var doc = {
                "_id": String(uId),
                "state": "pending",
                "title": title
              };
            state_db.put(doc);  
        }
        
}

function editResultItemWhenComplete(uId: string){
    // Get the div element by ID.
    const divElement = document.getElementById(uId);
    if (!divElement) {
        return;
    }

    // Update the link text.
    const linkElement = divElement.querySelector('a');
    linkElement!.textContent = 'Download';
    console.log("???????????? Done Download Set ???????????????")
}

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

    await filterAllDocuments()
  });


  async function filterAllDocuments() {
    state_db.allDocs({
        include_docs: true
      }).then(function (results) {
        results.rows.forEach((item: any) => {
            console.log("state_item: ===>" + JSON.stringify(item))
            if(item['doc'].state == 'pending' || item['doc'].state == 'complete' && item['doc'].title){
                console.log('Found pending job: ' + item['doc']._id)
                addPendingJobToPopup(item['doc']._id, item['doc'].title, true)

                if(item['doc'].state == 'complete'){
                    editResultItemWhenComplete(item['doc']._id)
                }
            }
        })
        // handle result
      }).catch(function (err) {
        console.log(err);
      });
  }


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


function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  

