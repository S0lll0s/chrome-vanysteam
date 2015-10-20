function click() {
  chrome.tabs.create({ url: "http://steamcommunity.com/profiles/no#" + document.getElementById('select').value });
}

function options() {
  chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
}

function init() {
  chrome.storage.local.get({personas: []}, function (data) {
    var select = document.getElementById('select');
    for (var persona of data.personas) {
      var opt = document.createElement('option');
      opt.innerHTML = persona;
      opt.value = "pers-" + persona;
      select.appendChild(opt);
    }
  });
  document.getElementById('apply').addEventListener('click', click);
  document.getElementById('options').addEventListener('click', options);
}

document.addEventListener('DOMContentLoaded', init);
