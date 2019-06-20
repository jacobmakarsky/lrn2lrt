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
        
        //Claim the LRN balance of this account in LRT
        //await instance.claim("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006",
        //                     "AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4",
        //                     "0x10f28cce1815d005b6e172d19070d91252187c7c320616ee4d9e1b104e1c93097dd639407aa1a1b2b3057b30efcb03444330927616f4cf4b22be9376ec2977f4");

        //let balAfter = await lrtToken.balanceOf("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006");
        //let balDiff = balAfter.sub(balBefore);

        //Check if the correct amount was added to the Tron wallet
        //assert.equal(balDiff, 0, "Token was added to the account");

        //Checks if invalid signature error occurs when calling an incorrect signature
        await truffleAssert.reverts(instance.claim("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006",
                                             "AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4",
                                             "0x10f28cce1815d005b6e172d19070d91252187c7c320616ee4d9e1b104e1c93097dd639407aa1a1b2b3057b30efcb03444330927616f4cf4b22be9376ec2977f4"),
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

        await instance.claim("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006",
                             "AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4",
                             "0x62d930ee6d41790a6bdf1653e487499b11e8db780dada84f8b1b52b577080e383c09d99eb90f3f71fb2586c95f74a5a03d5a49272e2d04e2441978727411ead4");

        let before = await lrtToken.balanceOf("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006");
        await instance.claim("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006",
                             "AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4",
                             "0x62d930ee6d41790a6bdf1653e487499b11e8db780dada84f8b1b52b577080e383c09d99eb90f3f71fb2586c95f74a5a03d5a49272e2d04e2441978727411ead4");
        let after = await lrtToken.balanceOf("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006");
        let diff = after.sub(before);

        assert.equal(diff, 0, "NEO account claimed tokens twice");
    });
});