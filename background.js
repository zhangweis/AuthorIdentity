function toHex(n) {
    var hex = Number(n).toString(16);
    return ("0"+hex).slice(-2);
}
var privKey;
chrome.storage.local.get("key", function(keys){
    privKey = bsv.PrivateKey.fromWIF(keys.key);
});
chrome.storage.onChanged.addListener(function(changes, area){
  if (!changes.key)return;
  privKey = bsv.PrivateKey.fromWIF(changes.key.newValue);
});
chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
 if (request.action != "sign") {
 sendResponse({error: "action must be sign"});
 return;
 }
 var append = '', signingAddr = '', sigStr = '';
 var scriptAsm = bsv.Script.fromASM(request.script.substring(request.script.indexOf(' ')+1) + ' 7c');
 if (scriptAsm.toHex().indexOf('2231394878696756345179427633744870515663554551797131707a5a56646f417574')!=0) return;
 var address = bsv.Address.fromPrivateKey(privKey);
 var str = address.toString();
 var result = "";
 for (i=0; i<str.length; i++) {
     result += toHex(str.charCodeAt(i));
 }
 signingAddr = ' ' + result;
 const signature = bsvMessage(scriptAsm.toBuffer())._sign(privKey).toCompact();
 sigStr = ' '+ signature.toString('hex');
 sigStr += ' '+ toHex(scriptAsm.chunks.length)+ ' '+ toHex(scriptAsm.chunks.length);
 for (var i = 0; i<scriptAsm.chunks.length;i++) {
     sigStr += ' '+toHex(i);
 }
 append = ' 7c 313550636948473232534e4c514a584d6f5355615756693757537163376843667661 424954434f494e5f4543445341'+signingAddr+'' +sigStr;
 sendResponse({appendScript:append});
 }
);