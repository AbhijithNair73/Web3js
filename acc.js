const Web3 = require('web3');
const web3 = new Web3('https://ropsten.infura.io/v3/1c29ade12ca8461a82b860b4223726c0');

let accountObj = web3.eth.accounts.create();
console.log('Account obj',accountObj);
