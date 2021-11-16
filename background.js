let checker = false;

class repeatBody{
    start = 0;
    end = 1;
    times = -1;
    constructor(url){
        this.url = url;
    }
}

chrome.tabs.onUpdated.addListener( function(tabId, changeInfo) {
    if(changeInfo.url && !checker){
        checker=true;
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: ['repeat.js']
        });
        chrome.scripting.insertCSS({
            target: {tabId: tabId},
            files: ['style.css']
        });
    }
});