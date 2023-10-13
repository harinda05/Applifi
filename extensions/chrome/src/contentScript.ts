import { Pagetype } from "./enum_store/linkedin_enums"
import { TabMessage } from "./type_store/linkedin_objs"

console.log('content-script-added')

chrome.runtime.onMessage.addListener((obj: TabMessage, sender, response) => {
    console.log("message received: {}", obj)
    if (obj.type == Pagetype.saved) {
        addGenerateCoverLetterButtonToSavedJobs();
    }
})

const addGenerateCoverLetterButtonToSavedJobs = () => {
    let parentClassName: string = "entity-result__content entity-result__divider pt3 pb3 t-12 t-black--light"
    var parentElements = document.getElementsByClassName(parentClassName);
    const elementArray = Array.from(parentElements);

    elementArray.forEach((p_element) => {
        if (p_element) {
            console.log("ttttttttttttttttttttttt")
            // Create the "Generate" list item
            var link_div = document.createElement('div');
            link_div.className = "applifi-generate-div"
    
            var generateBtn = document.createElement('button')
            generateBtn.type = 'button'
            generateBtn.textContent = "Applifi - Generate Cover Letter"
            link_div.appendChild(generateBtn)
    
            // Add a click event listener to the "Generate" option
            link_div.addEventListener('click', function () {
                // Define your action for the "Generate" option here
                // You can call a function or perform any desired action.
                // For example, you can open a new tab, generate a report, etc.
                alert('You clicked Generate!');
            });
    
            // Append the "Generate" option to the parent element
            p_element.appendChild(link_div);
    
        } else {
            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxx")
        }
    })

}
