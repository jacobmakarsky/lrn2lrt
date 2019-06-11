const LRT = artifacts.require("./LRT.sol");
const lrnTOlrt = artifacts.require("./lrnTOlrt.sol");

module.exports = function(deployer) {
  //First, deploy LRT contract. Then, deploy the LRN to LRT converter
  //passing the LRT address in as a reference
  deployer.deploy(LRT).then(() => {
    return deployer.deploy(lrnTOlrt, LRT.address);
  });
};