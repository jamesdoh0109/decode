var isExtensionActivated = false;

chrome.action.onClicked.addListener(toggleExtensionActivated);
chrome.tabs.onActivated.addListener(onTabSwitch);

function onTabSwitch(tab) { 
  // since content.js instances reset on tab switch, the global
  // background.js must communicate the extension's activation status to content.js
  chrome.tabs.sendMessage(tab.tabId, { isExtensionActivated });
}

function toggleExtensionActivated(tab) {
  isExtensionActivated = !isExtensionActivated;
  if (isExtensionActivated) {
    chrome.action.setIcon({ path: "logo_activated.jpg" });
  } else {
    chrome.action.setIcon({ path: "logo_deactivated.jpg" });
  }

  // let content.js know whether extension is activated 
  chrome.tabs.sendMessage(tab.id, { isExtensionActivated });

  chrome.storage.sync.set({ isExtensionActivated: isExtensionActivated });
}
