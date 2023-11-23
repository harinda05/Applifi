import { RuntimeCommandType_PBP } from "../src/enum_store/linkedin_enums";
import { RunTimeMessage_PBP, pendingJob } from "../src/obj_store/msg_objs";
let generateBtn = document.getElementById("generateButton")
      import PouchDB from "pouchdb";
      import PouchDBFind  from 'pouchdb-find';
      PouchDB.plugin(PouchDBFind );

      // Get the file input element.
const chatGPTToggle: HTMLInputElement = document.getElementById('chatGPTToggle') as HTMLInputElement;

const db = new PouchDB("my-pouchdb");
const state_db = new PouchDB("state-db")

const delImageIdPrefix = "del_"

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
      let useChatGpt = false;
      if (chatGPTToggle != null && chatGPTToggle.checked) {
        console.log('Chat GPT toggle is ON');
        useChatGpt = true
      } else {
        console.log('Chat GPT toggle is off');
      }

        let uId = Date.now() + getRandomInt(99999)
        let generate_btn_clicked_message: RunTimeMessage_PBP = {
            type :RuntimeCommandType_PBP.generate_btn_click_event,
            content: {
                uId : uId,
                useChatGpt: useChatGpt
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

        const deleteImg = document.createElement('img');
        deleteImg.src = 'delete-btn.png';
        deleteImg.id = delImageIdPrefix + uId

        resultItemDiv.appendChild(paragraphElement);
        resultItemDiv.appendChild(anchorElement);
        resultItemDiv.appendChild(deleteImg)
        resultItemDiv.addEventListener('click', handleDelImageClick);

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
    linkElement!.textContent = 'Save';
    linkElement!.id = uId
    linkElement!.className = 'save_a'

    // Bind the click event listener to the linkElement.
    linkElement!.addEventListener('click', handleLinkClick);
    console.log("???????????? Done Download Set ???????????????")
}

function handleDelImageClick(event:any) {
    const targetElementId = event.target.id;
    let jobId = targetElementId.substring(4)
    console.log("clicked on delete btn: " + jobId)

    state_db.get(jobId).then(function (doc) {
        return state_db.remove(doc);
      }).
      
      then(()=>{
        db.get(jobId).then(function (doc) {
            return db.remove(doc);
          })
      }).

      then(() => {
        const delElement = document.getElementById(jobId);
        if (!delElement) {
            return;
        } else {
            delElement.parentNode!.removeChild(delElement)
        }
      })
      
      .catch(err => {
        console.log(err);
      });
}


// Event handler function
function handleLinkClick(event:any) {
    // Get the linkElement's id.
    const linkElementId = event.target.id;
  
    console.log("U clicked on jobid: " + linkElementId)
    
    db.get(linkElementId).then(function (doc) {
        console.log('Cover letter exists')
        console.log(JSON.stringify(doc))  

        let intermediateDocObject: any = JSON.parse(JSON.stringify(doc))

        // Save the string as a text file.
        const blob = new Blob([intermediateDocObject.coverLetter], { type: 'text/plain' });
        const url_ = window.URL.createObjectURL(blob);

        // Create a hidden link element and set its href attribute to the URL of the Blob.
        const hiddenLinkElement = document.createElement('a');
        hiddenLinkElement.download = linkElementId + '.txt';
        hiddenLinkElement.href = url_;

        // Append the hidden link element to the document body and click it.
        document.body.appendChild(hiddenLinkElement);
        hiddenLinkElement.click();

        // Remove the hidden link element from the document body.
        document.body.removeChild(hiddenLinkElement);

    }).catch(function (err) {
        console.log('resume not found')
        console.log(err);
    });
  }

// Run the code when the popup opens.
window.addEventListener("load", async () => {
    const fileInput = document.querySelector('#file-input-label') as HTMLInputElement;

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

    setTimeout(() => {
      db.get("doc").then(function (item) {
        if(item){
          console.log('resume exists..........')

          if(fileInput){
            console.log('fileinput exists')
            fileInput.textContent = "file exists";
          } else {
            console.log('no fileinput')
          }

        } else {
          console.log('No resume found')
        }    
      });
    }, 0);
    
    // db.get("doc").then(function (item) {
    //     console.log('resume exists..........')
    //     fileInput.select()
    //     fileInput.placeholder =  "file exists";



        //----------------------------------------
        // const file = new File([blobOrBuffer], "resume.pdf", {
        //     type: "application/pdf",
        //   });
          
        //   // Create a new URL object from the File object.
        //   const url = URL.createObjectURL(file);
          
        //   // Create a new anchor element and set its `href` attribute to the URL object.
        //   const anchorElement = document.createElement("a");
        //   anchorElement.href = url;
        //   anchorElement.textContent = "Download Resume";
        //   anchorElement.download = "resume_1.pdf";

        //   // Append the anchor element to the popup HTML.
        //   document.body.appendChild(anchorElement);

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


const fileInput = document.querySelector('#file-input') as HTMLInputElement;


if(fileInput){
    fileInput.addEventListener('change', () => {
        // Get the selected file.
        let file: any;
        if(fileInput.files != null){
            file = fileInput.files[0];

            db.get('doc').then(function(doc) {
              let intermediateDocObject: any = JSON.parse(JSON.stringify(doc))
              console.log("Before updateL :::::::::::" + JSON.stringify(doc))
  
              return db.put({
                _id: 'doc', 
                _attachments: {
                  "resume": {
                    content_type: file.type,
                    data: file
                  }
                },
              name: file.name
              });
  
            }).then(function(response) {
              console.log("updated new resume response: " + response)
            }).catch(function (err) {
              console.log(err);
            });
            
        } else {
            console.error('No Resume Selected')
        }
      });
}



function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  

