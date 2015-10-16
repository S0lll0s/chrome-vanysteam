var keys = [
  "personaName",
  "real_name",
  "country", // DE
  "state",  // 16
  "city",   // 12623
];

function fileUpload(event) {
  var fr = new FileReader();
  fr.onload = function (e) {
    document.getElementById('image').src = e.target.result;
  }
  fr.readAsDataURL(event.target.files[0]);
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
    loadPersona({target: select});
  });
}

function addPersona() {
  chrome.storage.local.get({"personas": []}, function (data) {
    var name = document.getElementById('newname').value;
    data.personas.push(name);
    chrome.storage.local.set({"personas": data.personas});
    var opt = document.createElement('option');
    opt.innerHTML = name;
    opt.value = "pers-" + name;
    document.getElementById('select').appendChild(opt);
  });
}

function savePersona(event) {
  event.preventDefault();
  var pers = document.getElementById('select').value;
  var req = {};
  req[pers] = {};
  var form = document.getElementById('persona');
  for (var key of keys) {
    req[pers][key] = form[key].value;
  }
  req[pers].avatar = document.getElementById('image').src;
  console.log(req);
  chrome.storage.local.set(req, function () {
    req[pers] = {name: "noentry"};
    chrome.storage.local.get(req, function (data) { console.log(data) });
  });
}

function loadPersona(event) {
  var pers = event.target.value;
  var req = {};
  req[pers] = {realname: "NO ENTRY"};
  chrome.storage.local.get(req, function (data) {
    var form = document.getElementById('persona');
    for (var key of keys)
      form[key].value = data[pers][key] || "";
  
    document.getElementById('image').src = data[pers].avatar;
  });
}

document.addEventListener('DOMContentLoaded', init);
document.getElementById('add').addEventListener('click', addPersona);
document.getElementById('fileup').addEventListener('change', fileUpload, false);
document.getElementById('persona').addEventListener('submit', savePersona);
document.getElementById('select').addEventListener('change', loadPersona);
