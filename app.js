const Web3 = require('web3');
const web3 = new Web3('https://ropsten.infura.io/v3/1c29ade12ca8461a82b860b4223726c0');

const contractAddr = '0xAcF618e91B740329bf7Db6433cF7561FA9A1E459';
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "store",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "retrieve",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contract = new web3.eth.Contract(contractABI,contractAddr);
//console.log(contract);
contract.methods.retrieve().call().then(console.log);
contract.methods.store(20).send({from:'0xCbfC23B328Bf76A38D2BFd83fEbb92112013AE4D'}).then(console.log);
contract.methods.retrieve().call().then(console.log);