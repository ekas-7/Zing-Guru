document.getElementById('manageButton').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://gauravupadhyay.live' });
});