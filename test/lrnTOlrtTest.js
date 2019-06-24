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

        let test = await instance.verifyClaim.call("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006",
                             "0x61b401a5785e3b0314fcc29ff6b6bb8b232b69ce29a1846e2bbfbfc2b86467271711dcd3972432cdcbaa2cdbf4fa10fac5b015570c3b2bbb6a32e0f4f887244e");

        console.log(test);

        //Claim the LRN balance of this account in LRT
        //await instance.claim("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006",
        //                     "AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4",
        //                     "0x2323a29ac2b95a439c5b93f356718cda2e3dfd2ad4d12fc4d0b451f068b657a03b35feeca82dbb588bdb8ab0da1aacfa010686030fd24cfb40e0186e0fb8e935");

        //let balAfter = await lrtToken.balanceOf("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006");
        //let balDiff = balAfter.sub(balBefore);

        //Check if the correct amount was added to the Tron wallet
        //assert.equal(transferAmount, balDiff, "32 wasn't added to the account");
    });

    // it("Should not claim 32 LRT due to incorrect signature", async function() {
    //     //Deploy necessary contracts
    //     let instance = await l2l.deployed();
    //     let lrtToken = await lrt.deployed();

    //     const balBefore = await lrtToken.balanceOf("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006");
    //     const transferAmount = 32;

    //     //Transfer LRT to be claimed from the conversion contract
    //     lrtToken.transfer(instance.address, transferAmount);

    //     //Set LRN balance of a dummy NEO account
    //     await instance.setNeoBalance("AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4", transferAmount);

    //     //Checks if invalid signature error occurs when calling an incorrect signature
    //     await truffleAssert.reverts(instance.claim("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006",
    //                                                 "AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4",
    //                                                 "0xf13709f0883e1baf5b9c229504544bb5f3a3a35b1945dfefcb5f0a5f74c742c7a0481dfbce2fcbfdb693742ca1d8d6ff1a14322aeee5fbb5216bd9067212219c"),
    //                                 "Signature invalid");
    // });

    // it("Can't claim twice", async function() {
    //     //Deploy necessary contracts
    //     let instance = await l2l.deployed();
    //     let lrtToken = await lrt.deployed();

    //     const transferAmount = 100;

    //     //Transfer LRT to be claimed from the conversion contract
    //     lrtToken.transfer(instance.address, transferAmount);
    //     await instance.setNeoBalance("AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4", transferAmount);

    //     //Makes valid claim for the first time
    //     await instance.claim("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006",
    //                          "AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4",
    //                          "0x2323a29ac2b95a439c5b93f356718cda2e3dfd2ad4d12fc4d0b451f068b657a03b35feeca82dbb588bdb8ab0da1aacfa010686030fd24cfb40e0186e0fb8e935");

    //     //Makes valid claim for the second time, checks to see if it's allowed
    //     await truffleAssert.reverts(instance.claim("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006",
    //                                                 "AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4",
    //                                                 "0x2323a29ac2b95a439c5b93f356718cda2e3dfd2ad4d12fc4d0b451f068b657a03b35feeca82dbb588bdb8ab0da1aacfa010686030fd24cfb40e0186e0fb8e935"),
    //                                 "No tokens to claim");
    // });
});