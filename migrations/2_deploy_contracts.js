var DappToken = artifacts.require("./DappToken.sol");
var DappTokenSale = artifacts.require("./DappTokenSale.sol");

// price is 0.001ether
var tokenPrice = 1000000000000000;

var tokenInstance;

module.exports = function(deployer) {
  deployer.deploy(DappToken, 1000000).then(function() {
    return deployer.deploy(DappTokenSale, DappToken.address, tokenPrice);
  });

  deployer.then(function() {
    return DappToken.deployed();
  }).then(function(i) {
    tokenInstance = i;
    return DappTokenSale.deployed();
  }).then(function(i) {
    return tokenInstance.transfer(i.address, 750000);
  })
};
