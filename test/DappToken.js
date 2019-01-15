var DappToken = artifacts.require("./DappToken.sol");

contract("DappToken", function(accounts) {
    it("Initializes contract to correct values", async function() {
        var tokenInstance = await DappToken.deployed();
        // Name test
        var name = await tokenInstance.name();
        assert.equal(name, "DApp Token");
        // Symbol test
        var symbol = await tokenInstance.symbol();
        assert.equal(symbol, "DAPP");
        // Standard test
        var standard = await tokenInstance.standard();
        assert(standard, "DApp Token v1.0")
        // Total supply test
        var totalSupply = await tokenInstance.totalSupply();
        assert.equal(totalSupply.toNumber(), 1000000);
        // Verify if admin balance recieves totalSupply
        var adminBalance = await tokenInstance.balanceOf(accounts[0]);
        assert.equal(adminBalance.toNumber(), 1000000);
    });

    it("Transfers token ownership", async function() {
        var tokenInstance = await DappToken.deployed();
        var tokens = 250;
        var sender = accounts[0];
        var receipient = accounts[1];
        var senderInitialBalance = await tokenInstance.balanceOf(sender);
        var receipientInitialBalance = await tokenInstance.balanceOf(receipient);
        // assert transfer event
        var receipt = await tokenInstance.transfer(receipient, tokens, { from: sender });
        assert.equal(receipt.logs.length, 1);
        assert.equal(receipt.logs[0].event, "Transfer");
        // assert receipient balance
        var receipientBalance = await tokenInstance.balanceOf(receipient);
        assert.equal(receipientBalance.toNumber(), receipientInitialBalance.toNumber() + tokens);
        // assert sender balance
        var senderBalance = await tokenInstance.balanceOf(sender);
        assert.equal(senderBalance.toNumber(), senderInitialBalance.toNumber() - tokens);
        // assert transfer success
        var success = await tokenInstance.transfer.call(receipient, tokens, { from: sender });
        assert.equal(success, true);
    });

    it("Approves tokens for delegated transfer", async function() {
        var tokenInstance = await DappToken.deployed();
        var tokens = 500;
        var approver = accounts[0];
        var spender = accounts[1];
        // assert approval success
        var success = await tokenInstance.approve.call(spender, tokens, { from: approver });
        assert.equal(success, true);
        // assert approval event
        var receipt = await tokenInstance.approve(spender, tokens, { from: approver });
        assert.equal(receipt.logs.length, 1);
        assert.equal(receipt.logs[0].event, "Approval");
        // assert spender allowance
        var spenderAllowance = await tokenInstance.allowance(approver, spender);
        assert.equal(spenderAllowance.toNumber(), tokens);
    });

    it("Handles delegated token transfer", async function() {
        var tokenInstance = await DappToken.deployed();
        var tokens = 400;
        var approver = accounts[0];
        var spender = accounts[1];
        var receipient = accounts[2];
        var approverInitialBalance = await tokenInstance.balanceOf(approver);
        var spenderInitialAllowance = await tokenInstance.allowance(approver, spender);
        var receipientInitialBalance = await tokenInstance.balanceOf(receipient);
        // assert transfer success
        var success = await tokenInstance.transferFrom.call(approver, receipient, tokens, { from: spender });
        assert.equal(success, true);
        // assert transfer event
        var receipt = await tokenInstance.transferFrom(approver, receipient, tokens, { from: spender });
        assert.equal(receipt.logs.length, 1);
        assert.equal(receipt.logs[0].event, "Transfer");
        // assert approver balance
        var approverBalance = await tokenInstance.balanceOf(approver);
        assert.equal(approverBalance.toNumber(), approverInitialBalance.toNumber() - tokens);
        // assert receipient balance
        var receipientBalance = await tokenInstance.balanceOf(receipient);
        assert.equal(receipientBalance.toNumber(), receipientInitialBalance.toNumber() + tokens);
        // assert spender allowance
        var spenderAllowance = await tokenInstance.allowance(approver, spender);
        assert.equal(spenderAllowance.toNumber(), spenderInitialAllowance.toNumber() - tokens);
    });
});
