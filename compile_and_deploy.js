const Web3 = require("web3");
const solc = require("solc");
const fs = require("fs");
const path = require("path");
const web3 = new Web3(
  "https://ropsten.infura.io/v3/1c29ade12ca8461a82b860b4223726c0"
);

// read sol file
let filePath = path.join(__dirname, "Lottery", "lottery.sol");
console.log("File Path:", filePath);

let fileContent = fs.readFileSync(filePath).toString("utf-8");

var input = {
  language: "Solidity",
  sources: {
    "lottery.sol": {
      content: fileContent,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));

const abi = output.contracts["lottery.sol"]["lottery"].abi;
const bytecode = output.contracts["lottery.sol"]["lottery"].evm.bytecode.object;
//console.log("ABI: ", abi);
//console.log("Bytecode: ", bytecode);
const priv = "ea61e3ad6cef56b0de3a9aabcb39ff34805d523a5af70d0df306e043c7c42b46";
const signer = web3.eth.accounts.privateKeyToAccount("0x" + priv);
web3.eth.accounts.wallet.add(signer);
web3.eth.defaultAccount = signer.address;

let contract = new web3.eth.Contract(abi);
// console.log("Default acc:", contract.defaultAccount);
// console.log("Default options: ", contract.options);
let contractAddr;
// one way is to set default options first itself in new contract creation or update it before calling deploy. Else options can be filled at the time of calling deploy.

contract
  .deploy({ data: bytecode, arguments: [5, 10] })  // constructor call with arguments
  .send({from: signer.address, gasLimit: web3.utils.toHex(1500000), })
  .on("receipt", (receipt) => {
    // Contract Address will be returned here
    console.log("Contract Address:", receipt.contractAddress);
    contractAddr = receipt.contractAddress;
  })
  .then((initialContract) => {
    initialContract.methods.MINIMUM_BETTERS().call((err, data) => {
      console.log("Initial Data of MINIMUM_BETTERS:", data);
    });
  });
