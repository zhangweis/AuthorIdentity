
var myScript = document.createElement('script');
myScript.innerHTML = '('+function () {
    var interval;
    var serial = 0;
    var data = {};
    interval = setInterval(()=>{
        if (window.moneyButton) {
            clearInterval(interval);
            window.moneyButton.render1 = window.moneyButton.render;
            window.moneyButton.render = function() {
                console.log('proxied:', arguments);
                data[serial] = {element:arguments[0],options:arguments[1]};
                window.postMessage({type:'FROM_PAGE_TO_CONTENT_SCRIPT',action:'sign',script: arguments[1].outputs[0].script, serial:serial++}, '*');
            }
        }
    }, 10);
    setTimeout(()=>{clearInterval(interval)},10000);
window.addEventListener("message", function(event) {
    console.log(event.data, event.source == window)
  if (event.source != window)
    return;
  if (event.data.type && (event.data.type == "FROM_CONTENT_SCRIPT_TO_PAGE")) {        
    var {element,options} = data[event.data.serial];
    options.outputs[0].script += event.data.response.appendScript;
    delete data[event.data.serial];
    console.log(element, options);
    window.moneyButton.render1(element, options);
  } // else ignore messages seemingly not sent to yourself
}, false);

                     }.toString()+')()';

document.body.appendChild(myScript);

window.addEventListener("message", function(event) {
  // We only accept messages from this window to itself [i.e. not from any iframes]
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE_TO_CONTENT_SCRIPT")) {        
    chrome.runtime.sendMessage(event.data, function(response) {
        window.postMessage({type:'FROM_CONTENT_SCRIPT_TO_PAGE', response:response, serial:event.data.serial}, '*');
    }); // broadcasts it to rest of extension, or could just broadcast event.data.payload...
  } // else ignore messages seemingly not sent to yourself
}, false);
