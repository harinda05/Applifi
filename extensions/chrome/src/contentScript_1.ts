import { Pagetype } from "./enum_store/linkedin_enums"
import { TabMessage } from "./obj_store/linkedin_objs"


let add_generate_btn_flag = false;

window.addEventListener ("DOMContentLoaded", onWindowLoaded, false);
function onWindowLoaded (evt: any) {
    console.log('window-loading-done')
    var jsInitChecktimer = setInterval (checkForJS_Finish, 1000);
    function checkForJS_Finish () {
        if (add_generate_btn_flag) {
            clearInterval (jsInitChecktimer);
            addGenerateCoverLetterButtonToSearchedJobs();
        }
    }
}

chrome.runtime.onMessage.addListener(async (obj: TabMessage, sender, response) => {
    await wait(1000)
    console.log("message received: {}", obj)
    if (obj.type == Pagetype.saved) {
        addGenerateCoverLetterButtonToSavedJobs();
    } else if (obj.type == Pagetype.search) {
        add_generate_btn_flag = true;
    }
})

const addGenerateCoverLetterButtonToSavedJobs = () => {
    let parentClassName: string = "entity-result__content entity-result__divider pt3 pb3 t-12 t-black--light"
    var parentElements = document.getElementsByClassName(parentClassName);
    const elementArray = Array.from(parentElements);

    elementArray.forEach((p_element) => {
        // get job post link
        let linkElement = p_element.querySelector('a.app-aware-link');
        let linkHref: string | null;
        let linkText: string | null;

        if(linkElement != null){
            linkHref = linkElement.getAttribute('href');
            linkText = linkElement.textContent
        } else {
            console.error('Missing Link to Job Posting')
        }

        if (p_element) {
            console.log("ttttttttttttttttttttttt")
            var link_div = document.createElement('div');
            link_div.className = "applifi-generate-div"
    
            var generateBtn = document.createElement('button')
            generateBtn.type = 'button'
            generateBtn.textContent = "Applifi - Generate Cover Letter"
            link_div.appendChild(generateBtn)
    
            // Add a click event listener to the "Generate" option
            link_div.addEventListener('click', async function () {
                if(linkHref != null){
                   // Find a way to implement this !!!!
                }else {
                    console.error('Missing job posting link')
                }
                            
                //alert('You Clicked on the link' + linkHref + '  \n job title:' + linkText);
            });
    
            // Append the "Generate" option to the parent element
            p_element.appendChild(link_div);
    
        } else {
            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxx")
        }
    })
}

const addGenerateCoverLetterButtonToSearchedJobs = () => {
    console.log('search object -------- init');
    let parentClassName = "mt5 mb2";
    let p_ul = document.getElementsByClassName(parentClassName)[0];
    
    if (p_ul) {
        console.log('p_ul: ' + p_ul.className);
        let ul = p_ul.querySelector('ul');
        
        if (ul) {
            console.log('ul: ' + ul);

            let listitem = document.createElement('li');
            listitem.className = "job-details-jobs-unified-top-card__job-insight";

            let generateBtn = document.createElement('button');
            generateBtn.type = 'button';
            generateBtn.textContent = "Applifi - Generate Cover Letter";
            listitem.appendChild(generateBtn);
            ul.appendChild(listitem);

            // Add a click event listener to the "Generate" option
            listitem.addEventListener('click', async function () {
                
            });
        } else {
            console.log('ul not found');
        }
    } else {
        console.log('parent element not found');
    }
    console.log('add_generate_btn_flag set to false')
}

async function wait(durationInMilliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, durationInMilliseconds);
    });
  }
