chrome.storage.local.get('key',(keys)=>{
    document.getElementById("privKey").value = keys.key;
    linkTo(keys.key);
})
function linkTo(key) {
    var addr = bsv.Address.fromPrivateKey(bsv.PrivateKey.fromWIF(key)).toString();
    document.getElementById("link").href = 'https://zhangweis.github.io/#'+addr;

    document.getElementById("link").innerHTML = addr;
}
document.getElementById("changePrivateKey").onclick = function() {
    var value = document.getElementById("privKey").value;
    chrome.storage.local.set({key:value}, ()=>{
        linkTo(value);
        alert('private key saved!');
        
    });
}
