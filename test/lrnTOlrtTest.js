var l2l = artifacts.require("lrnTOlrt");
var lrt = artifacts.require("lrt.sol");
//Transfer a token into the test

contract('lrnTOlrt', function(accounts)
{
    const numberToBN = (num) => {
        const numHex = "0x" + num.toString(16);
        return web3.utils.toBN(numHex);
      };

    it("Should deposit 32 LRT", async function() {
        let instance = await l2l.deployed();

        const bal = await instance.setNeoBalance(
            numberToBN(32),
            "0x033a8De584c00E70F84dD1F4bcF73f904975D24F"
        );

        console.log("bal = " + bal);

        const tx = await instance.claim(accounts[0], "0x033a8De584c00E70F84dD1F4bcF73f904975D24F");
        let balance = await lrt.balanceOf(accounts[0]);
        console.log(balance);
        assert.equal(balance, numberToBN(32), "32 wasn't in the account");
    });
});