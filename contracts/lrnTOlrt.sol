pragma solidity >=0.4.0 <0.7.0;

//import the secp256r verifying library
import "./ECMath.sol";
import "./EllipticCurve.sol";

contract ERC20 
{
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
	ERC20 lrt; //erc20 token object called lrt to mock lrt
	ECMath math; //ecmath object 
	EllipticCurve ec; //elliptic curve object

	constructor(address _lrtAddress) public
	{
		//Define LRT as an ERC20 token
		lrt = ERC20(_lrtAddress);

		math = new ECMath();
		ec = new EllipticCurve();
	}

	//Mapping from NEO-address to number of claimable LRT tokens
	mapping (string => uint) neoBalances;

	function setNeoBalance(string memory neoAddr, uint balance) public
	{
		neoBalances[neoAddr] = balance;
	}

	//Verifies the signature of the claimer
	//*******BUGS*******
	//neo signature and address verification working
	//tron address and neo signature verification not working
	//... verification is working when neo signature has any message (should be the matching tron address)
	function verifyClaim(address tronAddr, bytes memory neoSig) public returns (bool)
	{
		bytes memory tronBytes = abi.encodePacked(tronAddr);
		bytes32 tron = keccak256(tronBytes);

		uint256 e = (uint256)(tron);
		uint256 r;
		uint256 s;
		uint8 v;

		//this gets r,s and v from the signature
		assembly {
			r := byte(0, mload(add(neoSig, 32)))
            s := byte(0, mload(add(neoSig, 64)))
            v := byte(0, mload(add(neoSig, 96)))
		}

		//recover the public key coordinates from the signature
		//(signature = e, public key = v, r from signature, s from signature)
		uint256[2] memory pubCoordinates = math.recover(e, v, r, s);

		uint256[2] memory signature = [ r, s ];

		//make sure the signature matches this address and pbkey coordinates
		return ec.validateSignature(tron, signature, pubCoordinates);
	}

	//Send the coin to the tronAddress only if the sender's NEO signature is valid
	function claim(address tronAddr, string memory neoAddr, bytes memory neoSig) public
	{
		require(verifyClaim(tronAddr, neoSig), "Signature invalid");
		require(neoBalances[neoAddr] > 0, "No tokens to claim");
		//If all the above conditions are met, then the transfer happen
    	require(lrt.transfer(tronAddr, neoBalances[neoAddr]), "Claim failed");

		//The claimers collectable balance is reset after the transfer occurs for retesting purposes
		neoBalances[neoAddr] = 0;
	}
}