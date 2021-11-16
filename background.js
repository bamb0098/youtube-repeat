class repeatBody{
    start = 0;
    end = 1;
    times = -1;
    constructor(url){
        this.url = url;
    }
}


chrome.tabs.onCreated.addListener( function(tab) {
    if(changeInfo.url){
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ['repeat.js']
        });
        chrome.scripting.insertCSS({
            target: {tabId: tab.id},
            files: ['style.css']
        });
    }
});

chrome.tabs.onUpdated.addListener( function(tabId, changeInfo) {
    if(changeInfo.url){
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