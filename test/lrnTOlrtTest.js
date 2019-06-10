var l2l = artifacts.require("lrnTOlrt");
//Transfer a token into the test

contract('lrnTOlrt', function(accounts)
{
    it("Should deposit 32 LRT", async function() {
        let instance = await l2l.deployed();
        
        console.log("intance address:", instance.address);

        const tx = await instance.setNeoBalance(
            web3.utils.toBN(32),
            "0x593e9DBCddcEd0Cd5926A693FA0577c12373a66F"
        );
        
        await instance.claim("0xC62C87ad50A621745b3aF515D01414f2B8cCD1C9", "0x593e9DBCddcEd0Cd5926A693FA0577c12373a66F");
        let balance = await web3.eth.getBalance("0xC62C87ad50A621745b3aF515D01414f2B8cCD1C9");
        assert.equal(balance, 32, "32 wasn't in the account");
    });
});