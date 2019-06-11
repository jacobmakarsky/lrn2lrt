pragma solidity >=0.4.0 <0.7.0;

contract ERC20 {
	function totalSupply() public view returns (uint256);
    function balanceOf(address who) public view returns (uint256);
    function transfer(address to, uint256 value) public returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Burn(address indexed burner, uint256 value);
}

//import the NEO address verifying library

/**
 * The lrnTOlrt maps LRT coin from NEO blockchain to LRN coin on TRON blockchain
 using a smart contract on the TRON network (coded with solidity)
 */
contract lrnTOlrt
{
	//store the tronWallet address, neoWallet address and neo wallet signature
	address payable tronWallet;
	string neoWallet;
	bytes32 neoSignature;

	address owner; //the owner must be sender of the message
	ERC20 lrt;

	constructor(address _lrtAddress) public
	{
		owner = msg.sender;
		//Define LRT as an ERC20 token
		lrt = ERC20(_lrtAddress);
	}

	//require owner of neoAddress to be the sender
	modifier onlyOwner
    {
        require (msg.sender == owner, "Not owner of contract");
        _;
    }

	//need a mapping from NEO-address to number of claimable LRT tokens
	mapping (string => uint) neoBalances;
	//***THIS WON'T WORK, NEED AN ORACLE (or a script) TO MAP THIS OUTSIDE THE CONTRACT
    //For now, we will just assume we know the balances in each account for testing

	function setNeoBalance(string memory neoAddr, uint balance) public onlyOwner
	{
		neoBalances[neoAddr] = balance;
	}

	//send the coin to the tronAddress only if the sender is the owner
	//... and NEO address is valid
	function claim(address payable tronAddr, string memory neoAddr) public
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

    	require(lrt.transfer(tronWallet, neoBalances[neoWallet]), "Claim failed");
		neoBalances[neoWallet] = 0;
	}
}