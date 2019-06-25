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
                            "0x08c434fea49c3c211b13688fa7d584fb005262ffecdf5eb0186f979893a8b3adf1e852ad219cac7d71326217f2e17c735180ad0888f3463f102b964d7328809e");

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
                                                    "0x9315439f874e5d698e4caaf2b0a25efe3d23e5c96d1ff7fdb43edbc4c6be8f145e5815e2ac905a1a1565ff685ead1784808f68a395b13728a12098172df7a927"),
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
                             "0x2323a29ac2b95a439c5b93f356718cda2e3dfd2ad4d12fc4d0b451f068b657a03b35feeca82dbb588bdb8ab0da1aacfa010686030fd24cfb40e0186e0fb8e935");

        //Makes valid claim for the second time, checks to see if it's allowed
        await truffleAssert.reverts(instance.claim("0x3132e27d840b8C1e24a5eE1f1BF611dD6f6f0006",
                                                    "AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4",
                                                    "0x2323a29ac2b95a439c5b93f356718cda2e3dfd2ad4d12fc4d0b451f068b657a03b35feeca82dbb588bdb8ab0da1aacfa010686030fd24cfb40e0186e0fb8e935"),
                                    "No tokens to claim");
    });
});