var DappTokenSale = artifacts.require("./DappTokenSale.sol");
var DappToken = artifacts.require("./DappToken.sol");

contract("DappTokenSale", function(accounts) {
    var tokensAvailable = 750000;
    var tokenPrice = 1000000000000000;
    var admin = accounts[0];
    var buyer = accounts[1];
    var tokensToBuy = 500;
    var value = tokensToBuy * tokenPrice;

    it("Initializes contract with the correct values", async function() {
        var tokenSaleInstance =  await DappTokenSale.deployed();
        var tokenInstance = await DappToken.deployed();

        var address = await tokenSaleInstance.address;
        assert.notEqual(address, 0*00);

        var tokenAddress = await tokenSaleInstance.tokenContract();
        assert.notEqual(tokenAddress, 0*00)

        var price = await tokenSaleInstance.tokenPrice();
        assert(price, tokenPrice);

        var totalSellingTokens = await tokenInstance.balanceOf(tokenSaleInstance.address);
        assert.equal(totalSellingTokens.toNumber(), tokensAvailable);

        var adminTokensLeft = await tokenInstance.balanceOf(admin);
        assert.equal(adminTokensLeft.toNumber(), 1000000 - tokensAvailable);
    });

    it("Facilitates token buying", async function() {
        var tokenSaleInstance =  await DappTokenSale.deployed();

        var receipt = await tokenSaleInstance.buyTokens(tokensToBuy, { from: buyer, value: value } );
        assert.equal(receipt.logs.length, 1);
        assert.equal(receipt.logs[0].event, "Sell");

        var tokensSold = await tokenSaleInstance.tokensSold();
        assert.equal(tokensSold.toNumber(), tokensToBuy);
    });

    it("Ends token sale", async function() {
        var tokenSaleInstance =  await DappTokenSale.deployed();
        var tokenInstance = await DappToken.deployed();

        var tokensSold = await tokenSaleInstance.tokensSold();
        await tokenSaleInstance.endSale({ from: admin });

        var tokenSaleBalance = await tokenInstance.balanceOf(tokenSaleInstance.address);
        assert.equal(tokenSaleBalance.toNumber(), 0);

        var adminBalance = await tokenInstance.balanceOf(admin);
        assert.equal(adminBalance.toNumber(), 1000000 - tokensSold.toNumber());
    });
});
