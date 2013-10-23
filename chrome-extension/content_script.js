var element;

document.addEventListener("contextmenu", function(event){
  console.log("contextmenu event detected");
  //if element is editable...
  element = event.target;
}, true);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    console.log("Received message:");
    console.log(request);
    if (request.cmd == "fillTextBox" && request.text !== undefined){
      console.log("Filling text box with '" + request.text + "'.");
      element.value = request.text;
    }
  }
);
