let isExtensionActivated = false;

// retrieve 'isExtensionActivated' state from storage 
chrome.storage.sync.get(
  ["isExtensionActivated"],
  function initializeExtensionActivationState(result) {
    isExtensionActivated = result.isExtensionActivated || false;
  }
);

// restore 'isExtensionActivated' on page refresh for current tab's content script 
// by sending a message from the background script
chrome.tabs.onUpdated.addListener(function onPageRefresh(tabId, changeInfo) {
  if (changeInfo.status === "complete") {
    sendMessageToContentScript(tabId);
  }
});

// communicate extension activation status to content script on tab switch
chrome.tabs.onActivated.addListener(function onTabSwitch(activeTab) {
  sendMessageToContentScript(activeTab.tabId);
});

chrome.action.onClicked.addListener(function onExtensionIconClick(activeTab) {
  isExtensionActivated = !isExtensionActivated;
  updateExtensionIcon();
  sendMessageToContentScript(activeTab.id);
  updateStorage();
});

function updateExtensionIcon() {
  const iconPath = isExtensionActivated
    ? "logo_activated.jpg"
    : "logo_deactivated.jpg";
  chrome.action.setIcon({ path: iconPath });
}

function sendMessageToContentScript(tabId) {
  chrome.tabs.sendMessage(tabId, {
    isExtensionActivated: isExtensionActivated,
  });
}

function updateStorage() {
  chrome.storage.sync.set({
    isExtensionActivated: isExtensionActivated,
  });
}
