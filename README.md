# lrn2lrt
Purpose:
Verifies the NEO signature and transfers funds to the tron wallet of a user who owns LRN and is eligible to claim LRT

Contracts:
ECMath.sol - Used for getting the NEO public key coordinates through the verify function
EllipticCurve.sol - Used for verifying the NEO signature using the validateSignature function
LRT.sol - Used to create dummy LRT token for testing as the real LRT token has not been created/deployed. Based on the LRC token.
lrnTOlrt.sol - Primary contract, contains key functionality

lrnTOlrt Functions:
setNeoBalance - Stores the balance of LRT avalible to claim based on LRN held by the user (Note: Balances are currently set manually in the test file, in production this function would be used by a script to set a balance for all LRN holders)
claim - Takes the claimer's tron address, neo address, and neo signature as parameters. If their signature is valid (contains the correct tron address as a message) and they are eligible to claim, then a transfer will occur. If the transfer successeds, their claimable balance will be reset and they will be unable to claim again.
verifyClaim - Takes the claimer's tron address and neo signature as parameters. Splits the signature then verifies if the signature is valid. Returns a boolean representing signature validity.

Notes:
Signature needs to be in bytes format when calling function (ie add 0x to the front).
Seems to be a bit more consistent if you sign with a hex rather than text.
Addresses are hardcoded in the test due to the nature of message signing, if you want to test on your machine you'll need to change the addresses and signatures in the test file.

Bugs:
Accepts any tron address when calling the contract, but this shouldn't matter as long as the NEO signature being passed in was made with the same NEO address being passed in. The NEO signature can be made with any message and the TRON address being passed in can be any address. We think they do not need to match. 

Questions to Look Into for the Future:
Is the tron address hashed properly for validation?
Is the NEO signature split up properly for validation?
Do the helper contracts work as intended?
Is the contract functional in Tron with minimal changes?
