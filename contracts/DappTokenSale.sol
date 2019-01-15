pragma solidity >=0.4.21 <0.6.0;

import "./DappToken.sol";

contract DappTokenSale {
    // Admin address
    address public admin;
    // DappToken instance
    DappToken public tokenContract;
    // Price of a single token
    uint256 public tokenPrice;
    // Total tokens sold
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    constructor (DappToken _tokenContract, uint256 _tokenPrice) public {
        // assign an admin
        admin = msg.sender;
        // assign Token contract
        tokenContract = _tokenContract;
        // assign Token price
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        // Require that payment matches token price
        require(msg.value >= tokenPrice * _numberOfTokens);
        // Require contract has enough tokens
        require(tokenContract.balanceOf(this) >= _numberOfTokens);
        // Require that the transfer is successful
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        // keep track of tokens sold
        tokensSold += _numberOfTokens;
        // emit a sell event
        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        // Require admin
        require(msg.sender == admin);
        // Require transfer of remaining dapp token to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));
        // Destroy contract
        selfdestruct(admin);
    }
}
