chrome.tabs.onUpdated.addListener(function(activeInfo) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var tab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['repeat.js']
        });
        chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['style.css']
        });
    });
});