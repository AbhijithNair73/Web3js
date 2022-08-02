const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
// console.log(web3);
web3.eth.getBalance('0xcd1c0813a8B0BA329395d039F85Dc8b9Fd9b2c0A').then((bal) => {
    console.log("Balance: ", web3.utils.fromWei(bal, 'ether'));
});
(async () => {
    let result = await web3.eth.getAccounts();
    console.log(result);
    console.log('type of :',typeof(result[0]));
    const txncomp = await web3.eth.sendTransaction({from:result[0], 
                    to:result[1], value:web3.utils.toWei("2",'ether')});
    console.log("Txn is sent and obj:",txncomp);
    console.log('##########################################');
    let txncount = await web3.eth.getBlockTransactionCount(txncomp.blockHash);
    console.log('txn count =',txncount);
    console.log('##########################################');
    let block = await web3.eth.getBlock(txncomp.blockHash);
    console.log('Block : ',block);
})();
