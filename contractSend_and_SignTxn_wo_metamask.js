const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;
const web3 = new Web3(
  "https://ropsten.infura.io/v3/1c29ade12ca8461a82b860b4223726c0"
);

const account1 = "0xCbfC23B328Bf76A38D2BFd83fEbb92112013AE4D";
const priv = "ea61e3ad6cef56b0de3a9aabcb39ff34805d523a5af70d0df306e043c7c42b46";
const PRIV_KEY = Buffer.from(priv, "hex");

// removing below lines fails
 const signer = web3.eth.accounts.privateKeyToAccount("0x" + priv);
 web3.eth.accounts.wallet.add(signer);
 web3.eth.defaultAccount = signer.address;

const contractAddr = "0xAcF618e91B740329bf7Db6433cF7561FA9A1E459";
const contractABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "num",
        type: "uint256",
      },
    ],
    name: "store",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "retrieve",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const contract = new web3.eth.Contract(contractABI, contractAddr);
//console.log(contract);

let rawData = contract.methods.store(50).encodeABI();

let txCount;
let test = async () => {
	
	// setting via contract method send() -> issue faced when only 'from: ' was passed, but gaslimit is also mandatory
  await contract.methods.store(45).send(
    {
      from: signer.address,
      // gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
      gasLimit: web3.utils.toHex(1000000),
      // value: 0,
    },
    (err, txnhash) => console.log("Txnhash for 45:", txnhash)
  );

  txCount = await web3.eth.getTransactionCount(signer.address);
  console.log("Txcount : ", txCount);
  await contract.methods.retrieve().call().then(console.log);

  let rawTx = {
    from: signer.address,
    nonce: web3.utils.toHex(txCount),
    gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
    gasLimit: web3.utils.toHex(1000000),
    to: contractAddr,
    value: 0,
    data: rawData,
  };

  // Issue faced: (No need here to specify ropsten chain)
  // please see that signTransaction is web3.eth.accounts while sendSignedTxn is web3.eth

  let signedTx = await web3.eth.accounts.signTransaction(
    rawTx,
    signer.privateKey
  );
  console.log("logging signed txn:", signedTx);
  await web3.eth
    .sendSignedTransaction(signedTx.rawTransaction)
    .on("receipt", console.log);

  await contract.methods.retrieve().call().then(console.log);
};
test();
