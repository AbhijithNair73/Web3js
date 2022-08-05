// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.7.0;

contract lottery {
    uint public MINIMUM_BETTERS;
    uint public BIDDING_NUMBER_LIMIT;
    uint public totalBetters;
    mapping(address => uint) public stakedAmount;
    mapping(uint => address[]) public bettersStake;
    address public owner;

    constructor () {
        owner = msg.sender;
        MINIMUM_BETTERS = 5;
        BIDDING_NUMBER_LIMIT = 10;
    }

    modifier onlyOwner{
        require(owner == msg.sender, "Not an Owner");
        _;
    }

    function setBiddingNumberLimit(uint _limit) external onlyOwner {
        require(_limit >= 10, "Minimum 1 digit bidding should be provided");
        BIDDING_NUMBER_LIMIT = _limit;
    }

    function setMinBetters(uint _limit) external onlyOwner {
        require(_limit >= 5, "Minimum 5 betters should stake");
        MINIMUM_BETTERS = 5;
    }

    function stake(uint _number) external payable {
        //check for minimum amount of stake and staking allowed only once for a user per lottery
        require(msg.value >= 0.01 ether, "Minimum 0.01 ethers needed to bet");
        // only staking possible on number less than 999, only 3 digit allowed.
        require(_number >=1 && _number <= 999,"number should be less than 999");
        bettersStake[_number].push(msg.sender);
        stakedAmount[msg.sender] = msg.value;
        totalBetters++;
    }

    function randomNumberGenerator() public view returns (uint){
        //uint randomNum = uint(keccak256(abi.encodePacked(block.timestamp,block.difficulty);))
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, 
        block.difficulty,
        (uint256(keccak256(abi.encode(block.coinbase)))),
        block.gaslimit,
        (uint256(keccak256(abi.encodePacked(msg.sender)))))));

        return seed % BIDDING_NUMBER_LIMIT;
    }

    function drawLottery() public payable {
        // some checks for minimum number of stakers
        require(totalBetters > MINIMUM_BETTERS, "not enough betters");
   
        uint luckyNumber = randomNumberGenerator();
        address [] memory winners = bettersStake[luckyNumber];
        uint winningAmount = address(this).balance;
        uint totalShare = 0;

        if(winners.length > 1)
        {
            for(uint8 idx = 0; idx < winners.length ; ++idx)
            {
                uint currentShare = stakedAmount[winners[idx]];
                totalShare += currentShare;
            }

            for(uint8 idx = 0; idx < winners.length ; ++idx)
            {
                uint indvidualShare = stakedAmount[winners[idx]];

                uint finalShare = (indvidualShare * winningAmount) / totalShare;

                require(finalShare <= winningAmount, "not enough fund");

                payable (winners[idx]).transfer(finalShare);  // will transfer use ether or wei
            }
        }
        else {
            kill(payable(owner));
        }
    } 

    function kill(address payable _to) public {
        selfdestruct(_to);
    }
    
}