//*******************************************
//disperse the mock LRT using lrn2lrt.sol and mock wallets

var l2l = artifacts.require("lrnTOlrt");
var lrt = artifacts.require("lrt.sol");
const truffleAssert = require('truffle-assertions');

contract('lrnTOlrt', function(accounts)
{
    it("Should claim 32 LRT", async function() 
    {
         //Deploy necessary contracts and make objects
        let lrn2lrt = await l2l.deployed();
        let lrtToken = await lrt.deployed();

        //get tron address balance before transfer
        const balBefore = await lrtToken.balanceOf("0x632E114f253F89BFb0C31d949320878CBbc73185");
        
        //transfer lrt from LRT.sol to lrnTOlrt.sol
        const transferAmount = 32;
        lrtToken.transfer(lrn2lrt.address, transferAmount);

        //set neo address from neo gui and fake address balance
        await lrn2lrt.setNeoBalance("APgRk6ytaWhsiurSryu9Ks3Ub2Dqkbf8HU", transferAmount);

        //*****************
        //(tron address, neo address, neo signature)
        //(any tron address, neo address matching signature from neo gui, neo signature made with any message in neo gui)
        //Claim the LRN balance of this account in LRT
        //neo sig needs 0x added to it when made on neo gui using text
        await lrn2lrt.claim("0x632E114f253F89BFb0C31d949320878CBbc73185",
                            "APgRk6ytaWhsiurSryu9Ks3Ub2Dqkbf8HU",
                            "0x6be40cb81695fdcd3fcf62aab80c0a30eb4d2ba591e18839a1bfa3817f597bdf4cacb891f0eed90ca31cc10c2a355b31b8c7277c5b5c5aa8ac8c6723fa29e9d5");

        //get tron address balance after transfer
        let balAfter = await lrtToken.balanceOf("0x632E114f253F89BFb0C31d949320878CBbc73185");
        //balDiff = balAfter - balBefore, should = 32
        let balDiff = (balAfter - balBefore);

        //Check if the correct amount was added to the Tron wallet
        assert.equal(transferAmount, balDiff, "32 wasn't added to the account");
    });

    it("Should not claim 32 LRT due to incorrect signature", async function() 
    {
        //Deploy necessary contracts
        let instance = await l2l.deployed();
        let lrtToken = await lrt.deployed();

        const balBefore = await lrtToken.balanceOf("0x632E114f253F89BFb0C31d949320878CBbc73185");
        const transferAmount = 32;

        //Transfer LRT to be claimed from the conversion contract
        lrtToken.transfer(instance.address, transferAmount);

        //Set LRN balance of a dummy NEO account
        await instance.setNeoBalance("AJaq6fXGw2MmqkF1zFL5YpESazKUZzpjp4", transferAmount);

        //Checks if invalid signature error occurs when calling an incorrect signature
        await truffleAssert.reverts(instance.claim("0x632E114f253F89BFb0C31d949320878CBbc73185",
                                                    "APgRk6ytaWhsiurSryu9Ks3Ub2Dqkbf8HU",
                                                    "0x9315439f874e5d698e4caaf2b0a25efe3d23e5c96d1ff7fdb43edbc4c6be8f145e5815e2ac905a1a1565ff685ead1784808f68a395b13728a12098172df7a928"),
                                    "Signature invalid");
    });

    it("Can't claim twice", async function() 
    {
        //Deploy necessary contracts
        let instance = await l2l.deployed();
        let lrtToken = await lrt.deployed();

        const transferAmount = 32;

        //Transfer LRT to be claimed from the conversion contract
        lrtToken.transfer(instance.address, transferAmount);
        await instance.setNeoBalance("0x632E114f253F89BFb0C31d949320878CBbc73185", transferAmount);

        //Makes valid claim for the first time
        await instance.claim("0x632E114f253F89BFb0C31d949320878CBbc73185",
                             "APgRk6ytaWhsiurSryu9Ks3Ub2Dqkbf8HU",
                             "0x2323a29ac2b95a439c5b93f356718cda2e3dfd2ad4d12fc4d0b451f068b657a03b35feeca82dbb588bdb8ab0da1aacfa010686030fd24cfb40e0186e0fb8e935");

        //Makes valid claim for the second time, checks to see if it's allowed
        await truffleAssert.reverts(instance.claim("0x632E114f253F89BFb0C31d949320878CBbc73185",
                                                    "APgRk6ytaWhsiurSryu9Ks3Ub2Dqkbf8HU",
                                                    "0x6be40cb81695fdcd3fcf62aab80c0a30eb4d2ba591e18839a1bfa3817f597bdf4cacb891f0eed90ca31cc10c2a355b31b8c7277c5b5c5aa8ac8c6723fa29e9d5"),
                                    "No tokens to claim");
    });
});