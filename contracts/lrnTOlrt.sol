pragma solidity >=0.4.0 <0.7.0;

//import the NEO address verifying library

/**
 * The lrnTOlrt maps LRT coin from NEO blockchain to LRN coin on TRON blockchain
 using a smart contract on the TRON network (coded with solidity)
 */
contract lrnTOlrt
{
	//store the tronWallet address, neoWallet address and neo wallet signature
	address payable tronWallet;
	address neoWallet;
	bytes32 neoSignature;

	address owner; //the owner must be sender of the message

	constructor() public
	{
		owner = msg.sender;
	}

	//require owner of neoAddress to be the sender
	modifier onlyOwner
    {
        require (msg.sender == owner);
        _;
    }

	//need a mapping from NEO-address to number of claimable LRT tokens
	mapping (address => uint) neoBalances;
	//***THIS WON'T WORK, NEED AN ORACLE (or a script) TO MAP THIS OUTSIDE THE CONTRACT
    //For now, we will just assume we know the balances in each account for testing

	function setNeoBalance(uint balance, address neoAddr) public
	{
		neoBalances[neoAddr] = balance;
	}

	//send the coin to the tronAddress only if the sender is the owner
	//... and NEO address is valid
	function claim(address payable tronAddr, address neoAddr) public
	{
		//take out the neo wallet address
		neoWallet = neoAddr;
		//take out the tron wallet address
		tronWallet = tronAddr;

		//1) after mapping neo wallet balance, need something to
		//... convert LRN to value of LRT coin
		//2) transfer amount from neoWallet to tronWallet, will work something
		//... like this
		//		neoWallet.transfer(neoBalance[tronWallet]);
		
        tronWallet.transfer(neoBalances[neoWallet]);
	}
}