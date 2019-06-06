pragma solidity >=0.4.0 <0.7.0;

//import the NEO address verifying library

import "./EllipticCurve.sol";


/**
 * The lrnTOlrt maps LRT coin from NEO blockchain to LRN coin on TRON blockchain
 using a smart contract on the TRON network (coded with solidity)
 */
contract lrnTOlrt
{
	//store the tronWallet address, neoWallet address and neo wallet signature
	address payable tronWallet;
	bytes neoWallet;
	bytes neoSignature;

	address owner; //the owner must be sender of the message

	constructor() 
	{
		owner = msg.sender;
	}

	//require the NEO signature to be valid using the imported library
	bool isValid = false;
	modifier isValid
	{ 
		require (EllipticCurve.validateSignature(msg.data,neoSignature,neo == true); 
		_; 
	}

	//require owner of neoAddress to be the sender
	modifier onlyOwner
    {
        require (msg.sender == owner);
        _;
    }

	//need a mapping from NEO-address to number of claimable LRT tokens
	mapping (bytes32 => uint) neoBalances;
	//***THIS WON'T WORK, NEED AN ORACLE TO MAP THIS OUTSIDE THE CONTRACT


	function setNeoBalance(bytes32 neoAddr, uint balance) onlyOwner 
	{
		neoBalances[neoAddr] = balance;
	}
	//send the coin to the tronAddress only if the sender is the owner
	//... and NEO address is valid
	function claim(address payable tronAddr, bytes neoAddr, bytes neoSig) public onlyOwner, isValid
	{
		//take out the neo wallet address
		neoWallet = neoAddr;
		//take out the neo wallet signature
		neoSignature = neoSig;
		//take out the tron wallet address
		tronWallet = tronAddr;

		//1) after mapping neo wallet balance, need something to
		//... convert LRN to value of LRT coin
		//2) transfer amount from neoWallet to tronWallet, will work something
		//... like this
		//		neoWallet.transfer(neoBalance[tronWallet]);

	}

}
