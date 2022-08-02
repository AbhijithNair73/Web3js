console.log("Welcome");
window.onload = function () {
    console.log('Window is now loaded');
    metaPresenceCheck();
    // SignatureFunc();
};
const message = "Hello World from India";
let metaAccount;
const metaPresenceCheck = async ()=>{
    if(window.ethereum) {
        console.log('window ethereum is injected');
        await window.ethereum.request({ method: "eth_requestAccounts" });
        window.web3 = new Web3(window.ethereum);
        var accounts = await web3.eth.getAccounts();
        metaAccount = accounts[0];
        document.getElementById("walletAddr").innerText = metaAccount;
        let netID = await web3.eth.net.getId();
        console.log('network ID = ',netID);
        let listening = await web3.eth.net.isListening();
        console.log('Listening = ',listening);
        const peerCount =await web3.eth.net.getPeerCount();
        console.log(peerCount,'Peer Counts connected to node',metaAccount);
    }

};

async function SignatureFunc() {
    let signature = await web3.eth.personal.sign(message,metaAccount);
    console.log('Signature: ',signature); 
    let ethAddrRecovered = await web3.eth.personal.ecRecover(message,signature);
    document.getElementById("recovery").innerText = ethAddrRecovered;
}
