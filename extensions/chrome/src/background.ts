import { TabMessage } from "./type_store/linkedin_objs"
import { Pagetype } from "./enum_store/linkedin_enums"

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if(changeInfo.status === 'complete' && tab.url && tab.url.includes("linkedin.com/my-items/saved-jobs")){
        console.log("url: " + tab.url)
        let tabMessage_saved: TabMessage = {
            type: Pagetype.saved
        }
        console.log(JSON.stringify(tabMessage_saved))
        chrome.tabs.sendMessage(tabId, tabMessage_saved)
    } else {
        console.log('------------- uewwwwwwwwwwwwwwwwwwwwwwwwwww')
    }
})