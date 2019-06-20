var l2l = artifacts.require("lrnTOlrt");
var lrt = artifacts.require("lrt.sol");
const truffleAssert = require('truffle-assertions');
//Transfer a token into the test

contract('lrnTOlrt', function(accounts)
{
    it("Should claim 32 LRT", async function() {
        //Deploy necessary contracts
        let instance = await l2l.deployed();
        let lrtToken = await lrt.deployed();

        const balBefore = await lrtToken.balanceOf("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006");
        const transferAmount = 32;

        //Transfer LRT to be claimed from the conversion contract
        lrtToken.transfer(instance.address, transferAmount);

        //Set LRN balance of a dummy NEO account
        await instance.setNeoBalance("AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4", transferAmount);

        //Claim the LRN balance of this account in LRT
        await instance.claim("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006",
                             "AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4",
                             "0x62d930ee6d41790a6bdf1653e487499b11e8db780dada84f8b1b52b577080e383c09d99eb90f3f71fb2586c95f74a5a03d5a49272e2d04e2441978727411ead4");

        let balAfter = await lrtToken.balanceOf("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006");
        let balDiff = balAfter.sub(balBefore);

        //Check if the correct amount was added to the Tron wallet
        assert.equal(transferAmount, balDiff, "32 wasn't added to the account");
    });

    it("Should not claim 32 LRT due to incorrect signature", async function() {
        //Deploy necessary contracts
        let instance = await l2l.deployed();
        let lrtToken = await lrt.deployed();

        const balBefore = await lrtToken.balanceOf("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006");
        const transferAmount = 32;

        //Transfer LRT to be claimed from the conversion contract
        lrtToken.transfer(instance.address, transferAmount);

        //Set LRN balance of a dummy NEO account
        await instance.setNeoBalance("AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4", transferAmount);

        //Checks if invalid signature error occurs when calling an incorrect signature
        await truffleAssert.reverts(instance.claim("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006",
                                                    "AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4",
                                                    "0x955de4f6336eacfa9f41592a4655e13b46d148e22cc4413185663924c887ec321b58d483e1d7c15681ff5f23070e2b9170ab9bc3cd0862a354c5e864c52be480"),
                                    "Signature invalid");
    });

    it("Can't claim twice", async function() {
        //Deploy necessary contracts
        let instance = await l2l.deployed();
        let lrtToken = await lrt.deployed();

        const transferAmount = 100;

        //Transfer LRT to be claimed from the conversion contract
        lrtToken.transfer(instance.address, transferAmount);
        await instance.setNeoBalance("AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4", transferAmount);

        //Makes valid claim for the first time
        await instance.claim("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006",
                             "AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4",
                             "0x62d930ee6d41790a6bdf1653e487499b11e8db780dada84f8b1b52b577080e383c09d99eb90f3f71fb2586c95f74a5a03d5a49272e2d04e2441978727411ead4");

        //Makes valid claim for the second time, checks to see if it's allowed
        await truffleAssert.reverts(instance.claim("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006",
                                                    "AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4",
                                                    "0x62d930ee6d41790a6bdf1653e487499b11e8db780dada84f8b1b52b577080e383c09d99eb90f3f71fb2586c95f74a5a03d5a49272e2d04e2441978727411ead4"),
                                    "No tokens to claim");
    });
});