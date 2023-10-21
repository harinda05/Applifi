import { RuntimeCommandType_CBC } from "./enum_store/linkedin_enums";
import { RunTimeMessage_CBC } from "./obj_store/msg_objs";


chrome.runtime.onMessage.addListener(async (message: RunTimeMessage_CBC, sender, response) => {
    console.log("message received: {}", JSON.stringify(message))
    let jobTitle: string | null;
    let jobDetails: string | null;

    if (message.type == RuntimeCommandType_CBC.get_job_details_request_search_jobs) {

        let jobTitle_element = document.getElementsByClassName('t-24 t-bold job-details-jobs-unified-top-card__job-title')[0]
        jobTitle = jobTitle_element.textContent

        let jobDetails_parent = document.getElementsByClassName('jobs-description__content jobs-description-content')[0]
        console.log("jobDetails_parent => " + jobDetails_parent)

        let nestedElement = jobDetails_parent.querySelector('span');
        
        if(nestedElement != undefined){
            jobDetails = nestedElement.textContent
        } else {
            jobDetails = ''
            console.log('undefiled nested element')
        }
        console.log(jobDetails)

        let job_detail_resp = {
            title: jobTitle,
            details: jobDetails
        }

        response(job_detail_resp)
    }
})