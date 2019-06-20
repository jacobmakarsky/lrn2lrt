pragma solidity >=0.4.0 <0.7.0;

//import the secp256r verifying library
import "./ECMath.sol";

contract ERC20 {
	function totalSupply() public view returns (uint256);
    function balanceOf(address who) public view returns (uint256);
    function transfer(address to, uint256 value) public returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Burn(address indexed burner, uint256 value);
}

/**
 * The lrnTOlrt maps LRT coin from NEO blockchain to LRN coin on TRON blockchain
 using a smart contract on the TRON network (coded with solidity)
 */
contract lrnTOlrt
{
	address owner; //the owner must be sender of the message

	ERC20 lrt;
	ECMath math;

	constructor(address _lrtAddress) public
	{
		owner = msg.sender;
		//Define LRT as an ERC20 token
		lrt = ERC20(_lrtAddress);
		math = new ECMath();
	}

	//require owner of neoAddress to be the sender
	modifier onlyOwner
    {
        require (msg.sender == owner, "Not owner of contract");
        _;
    }

	//Mapping from NEO-address to number of claimable LRT tokens
	mapping (string => uint) neoBalances;

	function setNeoBalance(string memory neoAddr, uint balance) public onlyOwner
	{
		neoBalances[neoAddr] = balance;
	}

	//Send the coin to the tronAddress only if the sender's NEO signature is valid
	function claim(address payable tronAddr, string memory neoAddr, bytes memory neoSig) public
	{
		require(verifyClaim(tronAddr, neoSig), "Signature invalid");
    	require(lrt.transfer(tronAddr, neoBalances[neoAddr]), "Claim failed");
		neoBalances[neoAddr] = 0;
	}

	//Verifies the signature of the claimer
	//Notes: Can distinquish between the signatures of different users but doesn't seem to distinquish
	//between different signatures by the same user
	//Also requires signature to be in bytes format when calling function (ie add 0x to the front)
	function verifyClaim(address tronAddr, bytes memory neoSig) public returns (bool)
	{
		bytes memory tronBytes = abi.encodePacked(tronAddr);

		uint256 e;
		uint256 r;
		uint256 s;
		uint8 v;

		assembly {
			e := byte(0, mload(add(tronBytes, 0x20)))
			r := byte(0, mload(add(neoSig, 0x20)))
			s := byte(0, mload(add(neoSig, 0x40)))
			v := byte(0, mload(add(neoSig, 0x60)))
		}

		uint256[2] memory addrCoordinates = math.recover(e, v, r, s);

		return math.verify(addrCoordinates[0], addrCoordinates[1], e, r, s);
	}
}