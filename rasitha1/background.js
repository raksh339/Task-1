let siteData = {};
let activeTab = null;
let startTime = Date.now();

chrome.tabs.onActivated.addListener(activeInfo => {
  if (activeTab) {
    let timeSpent = Date.now() - startTime;
    saveTime(activeTab.url, timeSpent);
  }
  chrome.tabs.get(activeInfo.tabId, tab => {
    activeTab = tab;
    startTime = Date.now();
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete") {
    if (activeTab) {
      let timeSpent = Date.now() - startTime;
      saveTime(activeTab.url, timeSpent);
    }
    activeTab = tab;
    startTime = Date.now();
  }
});

function saveTime(url, timeSpent) {
  let domain = new URL(url).hostname;
  siteData[domain] = (siteData[domain] || 0) + timeSpent;

  chrome.storage.local.set({ siteData });
}
