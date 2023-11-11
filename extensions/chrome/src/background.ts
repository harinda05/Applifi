import { TabMessage } from "./obj_store/linkedin_objs"
import { Pagetype, RuntimeCommandType_CBC, RuntimeCommandType_PBP } from "./enum_store/linkedin_enums"
import { JobDetails_CB, RunTimeMessage_CBC, RunTimeMessage_PBP, pendingJob } from "./obj_store/msg_objs"
import PouchDB from "pouchdb";
import {connect, webSocket, sessionId} from "./utils/websocket-provider"
let active_tab: chrome.tabs.Tab;

let rest_server_uri = "http://localhost:8080/generate-cover-letter" // move to config
let server_uri = "ws://localhost:8080/websocket"
connect(server_uri)

const db = new PouchDB("my-pouchdb");
const state_db = new PouchDB("state-db")

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     console.log("url: " + tab.url)
//     if(changeInfo.status === 'complete' && tab.url && tab.url.includes("linkedin.com/jobs/search/?currentJobId")){

//         let enable_generate_btn_message : RunTimeMessage = {
//             type: RuntimeCommandType.enable_generate_event
//         }
//         chrome.runtime.sendMessage(enable_generate_btn_message)
//     }
// })

const websocketConn = connect(server_uri)

chrome.tabs.onActivated.addListener((activeInfo) => {
    // activeInfo contains information about the newly activated tab
    const tabId = activeInfo.tabId;
    const windowId = activeInfo.windowId;

    // get the tab object
    chrome.tabs.get(tabId, (tab) => {
        active_tab = tab;
        // Now, activeTab contains the details of the newly activated tab
        console.log(`Active tab changed. Tab ID: ${tabId}, Window ID: ${windowId}`);
    });
});


// listening to message from popup js
chrome.runtime.onMessage.addListener((message: RunTimeMessage_PBP, sender, sendResponse) => {
    // Check if the message indicates to enable the button
    console.log('chrome run time message received => ' + JSON.stringify(message))
    if (message.type === RuntimeCommandType_PBP.request_enable_generate_event) {
        console.log("active_tab => " + active_tab.url)
        let type: RuntimeCommandType_PBP;

        if (active_tab.url && active_tab.url.includes("linkedin.com/jobs/search/?currentJobId")) {
            type = RuntimeCommandType_PBP.enable_generate_event
        } else {
            type = RuntimeCommandType_PBP.disable_generate_event
        }

        let enable_generate_btn_message: RunTimeMessage_PBP = {
            type: type
        }

        sendResponse(enable_generate_btn_message);
    }

    else if (message.type === RuntimeCommandType_PBP.generate_btn_click_event) {
        let get_job_description_cs_message: RunTimeMessage_CBC = {
            type: RuntimeCommandType_CBC.get_job_details_request_search_jobs
        }

        let jobUId = message.content.uId;
        let title: string = '';
        
        if (active_tab.id) {

            let file: File;
            db.getAttachment("doc", "resume").then(function (blobOrBuffer) {
                console.log('resume exists -- background')
                console.log(blobOrBuffer)  
                //----------------------------------------
                file = new File([blobOrBuffer], "resume.pdf", {
                    type: "application/pdf",
                  }); 
                  console.log(file.size) 
                })

            chrome.tabs.sendMessage(active_tab.id, get_job_description_cs_message, (response: JobDetails_CB) => {
                const boundary = '--------------------------' + Math.floor(Math.random() * 1000000000);

                title = response.title
                console.log('This is title before: ' + title)


                let formData    = new FormData();
                formData.append( 'description', JSON.stringify(response) );
                formData.append( 'resume', file );
                formData.append( 'sessionId', sessionId)
                formData.append( 'jobId', jobUId)

                const options = {
                    method: 'POST',
                    body: formData // Convert the data to JSON format
                };

                console.log('formDAta ===>' + JSON.stringify(formData))

               //Send the POST request ----------------> !!!!! This needs to be updated with a socket connection !!!!! 
                fetch(rest_server_uri, options)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        console.log(JSON.stringify(response)); // Parse the response JSON
                    })
                    .then(data => {
                        // Handle the response data
                        console.log(data);
                        
                    })
                    .catch(error => {
                        // Handle any errors
                        console.error('Fetch error:', error);
                    });


                    console.log('This is title after: ' + title)
                    let pendingJobResponse: pendingJob = {
                        title: title,
                        uId: jobUId
                    };
                    // Send Response of a Pending task

                    console.log("sendResponse_bacckground: " + sendResponse)
                    sendResponse(pendingJobResponse)
                    
            });

            return true
        } else {
            console.error('missing tab id')
        }
    } else if (message.type === RuntimeCommandType_PBP.file_upload_event){
        console.log('received upload_file_event_message message to background: ', message)
        if(message.content){
            const file: string = message.content.get('file');
            console.log('file ===>' , file)
            // Store the file in Chrome memory.
            chrome.storage.local.set({ applifi_resume1: file }, function() {
                if (chrome.runtime.lastError) {
                    console.error("Error saving to local storage: " + chrome.runtime.lastError);
                } else {
                    console.log("Data saved successfully.");
                }
            });

            sendResponse('Resume added to chrome storage')
        } else {
            sendResponse('no file found')
        }
    }
})


export function addGeneratedCoverLetterToPouchDb(coverLetter: string, jobId: string){

    console.log("adding to db: job Id: " + jobId)
    var doc = {
        "_id": String(jobId),
        "coverLetter": coverLetter
      };

    let alert_coverletter_generation_complete: RunTimeMessage_PBP = {
        type: RuntimeCommandType_PBP.alert_coverletter_complete,
        content: {
            uId: jobId
        }
    }
    db.put(doc).then(() => {

        state_db.get(jobId).then(function(doc) {
            let intermediateDocObject: any = JSON.parse(JSON.stringify(doc))
            console.log("Before updateL :::::::::::" + JSON.stringify(doc))

            return state_db.put({
              _id: jobId,
              _rev: doc._rev,
              state: "complete",
              title: intermediateDocObject.title
            });

          }).then(function(response) {
            console.log("updated document state: id: " + jobId + "response: " + response)
          }).catch(function (err) {
            console.log(err);
          });

        console.log("alert_coverletter_generation_complete msg to popupjs")
        chrome.runtime.sendMessage(alert_coverletter_generation_complete)
    }); 

}