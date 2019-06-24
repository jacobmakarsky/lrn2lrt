pragma solidity >=0.4.0 <0.7.0;

//import the secp256r verifying library
import "./ECMath.sol";
import "./EllipticCurve.sol";

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
	EllipticCurve ec;

	constructor(address _lrtAddress) public
	{
		owner = msg.sender;
		//Define LRT as an ERC20 token
		lrt = ERC20(_lrtAddress);
		math = new ECMath();
		ec = new EllipticCurve();
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
		require(neoBalances[neoAddr] > 0, "No tokens to claim");
    	require(lrt.transfer(tronAddr, neoBalances[neoAddr]), "Claim failed");
		neoBalances[neoAddr] = 0;
	}

	//Verifies the signature of the claimer
	//Notes: Doesn't seem to distingish between who submits the signature
	//Doesn't seem to view signatures that start with a as valid
	//Also requires signature to be in bytes format when calling function (ie add 0x to the front)
	function verifyClaim(address tronAddr, bytes memory neoSig) public returns (bool)
	{
		bytes memory tronBytes = abi.encodePacked(tronAddr);
		bytes32 tron = keccak256(tronBytes);

		uint256 e = (uint256)(tron);
		uint256 r;
		uint256 s;
		uint8 v;

		assembly {
			r := byte(0, mload(add(neoSig, 32)))
            s := byte(0, mload(add(neoSig, 64)))
            v := byte(0, mload(add(neoSig, 96)))
		}

		uint256[2] memory pubCoordinates = math.recover(e, v, r, s);

		uint256[2] memory signature = [ r, s ];

		return ec.validateSignature(tron, signature, pubCoordinates);
	}

	function parseAddr(string memory _a) public pure returns (address _parsedAddress) {
    bytes memory tmp = bytes(_a);
    uint160 iaddr = 0;
    uint160 b1;
    uint160 b2;
    for (uint i = 2; i < 2 + 2 * 20; i += 2) {
        iaddr *= 256;
        b1 = uint160(uint8(tmp[i]));
        b2 = uint160(uint8(tmp[i + 1]));
        if ((b1 >= 97) && (b1 <= 102)) {
            b1 -= 87;
        } else if ((b1 >= 65) && (b1 <= 70)) {
            b1 -= 55;
        } else if ((b1 >= 48) && (b1 <= 57)) {
            b1 -= 48;
        }
        if ((b2 >= 97) && (b2 <= 102)) {
            b2 -= 87;
        } else if ((b2 >= 65) && (b2 <= 70)) {
            b2 -= 55;
        } else if ((b2 >= 48) && (b2 <= 57)) {
            b2 -= 48;
        }
        iaddr += (b1 * 16 + b2);
    }
    return address(iaddr);
}
}