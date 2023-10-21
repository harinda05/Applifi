import { RuntimeCommandType_PBP } from "../src/enum_store/linkedin_enums";
import { RunTimeMessage_PBP } from "../src/obj_store/msg_objs";
let generateBtn = document.getElementById("generateButton")

// chrome.runtime.onMessage.addListener((message: RunTimeMessage, sender, sendResponse)  => {
//     // Check if the message indicates to enable the button
//     console.log('activate generate btn event')

// });

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


if(generateBtn){
    generateBtn.addEventListener("click", function () {
        let generate_btn_clicked_message: RunTimeMessage_PBP = {
            type :RuntimeCommandType_PBP.generate_btn_click_event
        }
        chrome.runtime.sendMessage(generate_btn_clicked_message);
    });
}
