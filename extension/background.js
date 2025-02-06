let blockedSites = [];

function updateBlockedSites() {
  blockedSites = [
    { url: "facebook.com", blockedUntil: "2025-12-31T23:59:59Z" },
    { url: "example.com", blockedUntil: null },
    { url: "youtube.com", blockedUntil: "2025-06-01T12:00:00Z" }
  ];

  chrome.storage.local.set({ blockedSites });
}

function shouldBlock(url) {
  try {
    const hostname = new URL(url).hostname;
    return blockedSites.some(site => {
      if (site.blockedUntil) {
        return hostname.includes(site.url) && new Date(site.blockedUntil) > new Date();
      }
      return hostname.includes(site.url);
    });
  } catch (error) {
    return false;
  }
}

// Listen for tab updates and redirect to `blocked.html`
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading" && shouldBlock(tab.url)) {
    chrome.tabs.update(tabId, {
      url: chrome.runtime.getURL("blocked.html") // Redirect to a custom page
    });
  }
});

// Restore blocked sites from storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("blockedSites", (data) => {
    if (data.blockedSites) {
      blockedSites = data.blockedSites;
    } else {
      updateBlockedSites();
    }
  });
});

updateBlockedSites();
