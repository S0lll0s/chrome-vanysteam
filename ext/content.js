var keys = [
  "personaName",
  "real_name",
  "country",  // DE
  "state",    // 16
  "city"      // 12623
];

// Thanks to @cuixiping of SO: http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata#answer-30470303
function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}


function switchTo(persona) {
  var form = document.getElementById('editForm');
  var avyform = document.getElementById('avatar_upload_form');
  for (var key of keys) {
    form[key].value = persona[key] || "";
  } 
  if (persona.avatar) { 
    document.getElementById('avatar_full_img').src = persona.avatar;

    var fdata = new FormData(avyform);
    fdata.append("avatar", dataURLtoBlob(persona.avatar));
    var request = new XMLHttpRequest();
    request.open("POST", "http://steamcommunity.com/actions/FileUploader");
    request.send(fdata);
  }
  form.submit();
}

function init() {
  var btn = document.createElement('button');
  var select = document.createElement('select');
  
  btn.innerHTML = "<span>switch to persona</span>";
  btn.className += " btn_grey_white_innerfade";
  btn.className += " btn_medium";
  btn.type = "button";
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    var pers = select.value;
    var req = {};
    req[pers] = {};

    chrome.storage.local.get(req, function (data) {
      switchTo(data[pers]);
    });
  });

  chrome.storage.local.get({personas: []}, function (data) {
    for (var persona of data.personas) {
      var opt = document.createElement('option');
      opt.innerHTML = persona;
      opt.value = "pers-" + persona;
      select.appendChild(opt);
    }   
  });
  document.querySelector('.forum_manage_actions').appendChild(btn);
  document.querySelector('.forum_manage_actions').appendChild(select);
}
init();
