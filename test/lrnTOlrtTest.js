var l2l = artifacts.require("lrnTOlrt");
var lrt = artifacts.require("lrt.sol");
//Transfer a token into the test

contract('lrnTOlrt', function(accounts)
{
    it("Should claim 32 LRT", async function() {
        //Deploy necessary contracts
        let instance = await l2l.deployed();
        let lrtToken = await lrt.deployed();

        const balBefore = await lrtToken.balanceOf(accounts[1]);
        const transferAmount = 32;

        //Transfer LRT to be claimed from the conversion contract
        lrtToken.transfer(instance.address, transferAmount);

        //Set LRN balance of a dummy NEO account
        await instance.setNeoBalance("AM5ZSXKMfCck9fLATKtqjVm7iYW9uzNp2K", transferAmount);

        //Claim the LRN balance of this account in LRT
        await instance.claim(accounts[1], "AM5ZSXKMfCck9fLATKtqjVm7iYW9uzNp2K");

        let balAfter = await lrtToken.balanceOf(accounts[1]);
        let balDiff = balAfter.sub(balBefore);

        //Check if the correct amount was added to the Tron wallet
        assert.equal(transferAmount, balDiff, "32 wasn't added to the account");
    });

    it("Can't claim twice", async function() {
        //Deploy necessary contracts
        let instance = await l2l.deployed();
        let lrtToken = await lrt.deployed();

        const transferAmount = 100;
        //Transfer LRT to be claimed from the conversion contract
        lrtToken.transfer(instance.address, transferAmount);
        await instance.setNeoBalance("AM5ZSXKMfCck9fLATKtqjVm7iYW9uzNp2K", transferAmount);

        //let ac1Before = await lrtToken.balanceOf(accounts[1]);
        await instance.claim(accounts[1], "AM5ZSXKMfCck9fLATKtqjVm7iYW9uzNp2K");
        //let ac1After = await lrtToken.balanceOf(accounts[1]);
        //let ac1Diff = ac1After.sub(ac1Before);

        let ac2Before = await lrtToken.balanceOf(accounts[2]);
        await instance.claim(accounts[2], "AM5ZSXKMfCck9fLATKtqjVm7iYW9uzNp2K");
        let ac2After = await lrtToken.balanceOf(accounts[2]);
        //let ac2Diff = ac2After.sub(ac2Before);

        assert.notEqual(ac2Before, ac2After, "Two accounts claimed the balance of the same NEO account");
    });
});