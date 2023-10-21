import { TabMessage } from "./obj_store/linkedin_objs"
import { Pagetype, RuntimeCommandType_CBC, RuntimeCommandType_PBP } from "./enum_store/linkedin_enums"
import { RunTimeMessage_CBC, RunTimeMessage_PBP } from "./obj_store/msg_objs"

let active_tab: chrome.tabs.Tab;

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     console.log("url: " + tab.url)
//     if(changeInfo.status === 'complete' && tab.url && tab.url.includes("linkedin.com/jobs/search/?currentJobId")){

//         let enable_generate_btn_message : RunTimeMessage = {
//             type: RuntimeCommandType.enable_generate_event
//         }
//         chrome.runtime.sendMessage(enable_generate_btn_message)
//     }
// })


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
    console.log('activate generate btn event => ' + JSON.stringify(message))
    if (message.type === RuntimeCommandType_PBP.request_enable_generate_event) {
        console.log("active_tab => " + active_tab.url )
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
    
    else if (message.type === RuntimeCommandType_PBP.generate_btn_click_event){
        let get_job_description_cs_message: RunTimeMessage_CBC = {
            type: RuntimeCommandType_CBC.get_job_details_request_search_jobs
        }
        if(active_tab.id){
            chrome.tabs.sendMessage(active_tab.id, get_job_description_cs_message, response => {

                // Make the http call to back end service and get the generated cover letter + add a section to the popup
                console.log(JSON.stringify(response))
            });
        }else {
            console.error('missing tab id')
        }
    }

})