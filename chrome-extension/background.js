function $(e){if(typeof e=='string')e=document.getElementById(e);return e};
function collect(a,f){var n=[];for(var i=0;i<a.length;i++){var v=f(a[i]);if(v!=null)n.push(v)}return n};

ajax={};
ajax.x=function(){try{return new ActiveXObject('Msxml2.XMLHTTP')}catch(e){try{return new ActiveXObject('Microsoft.XMLHTTP')}catch(e){return new XMLHttpRequest()}}};
ajax.serialize=function(f){var g=function(n){return f.getElementsByTagName(n)};var nv=function(e){if(e.name)return encodeURIComponent(e.name)+'='+encodeURIComponent(e.value);else return ''};var i=collect(g('input'),function(i){if((i.type!='radio'&&i.type!='checkbox')||i.checked)return nv(i)});var s=collect(g('select'),nv);var t=collect(g('textarea'),nv);return i.concat(s).concat(t).join('&');};
ajax.send=function(u,f,m,a){var x=ajax.x();x.open(m,u,true);x.onreadystatechange=function(){if(x.readyState==4)f(x.responseText)};if(m=='POST')x.setRequestHeader('Content-type','application/x-www-form-urlencoded');x.send(a)};
ajax.get=function(url,func){ajax.send(url,func,'GET')};
ajax.gets=function(url){var x=ajax.x();x.open('GET',url,false);x.send(null);return x.responseText};
ajax.post=function(url,func,args){ajax.send(url,func,'POST',args)};
ajax.update=function(url,elm){var e=$(elm);var f=function(r){e.innerHTML=r};ajax.get(url,f)};
ajax.submit=function(url,elm,frm){var e=$(elm);var f=function(r){e.innerHTML=r};ajax.post(url,f,ajax.serialize(frm))};


var emailAddr = 'kasm@kasm.com';

function sendToTab(msg){
  chrome.tabs.query({active: true, currentWindow: true},
    function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, msg);
    }
  );
}

function generateText(callback){
  ajax.post('http://maskr.me/welcome/create',
            callback,
            'email=' + emailAddr);
}

function kasmClickHandler(sendResponse){
  console.log("Created kasmClickHandler");
  return function(info, tab){
    console.log("Handled contextmenu click");
    //dim screen? Change color of textbox?
    generateText(function(response){
      var resp = JSON.parse(response);
      console.log(resp);
      var email = resp.username + '@maskr.me';
      sendResponse({cmd: "fillTextBox",
                    text: email});
    });
    //undim screen restore color
  }
}

chrome.contextMenus.create({
  "title": "Fill textbox",
  "contexts": ["editable"],
  "onclick" : kasmClickHandler(sendToTab)
});
