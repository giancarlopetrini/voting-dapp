const Election = artifacts.require('./Election.sol');

module.exports = (deployer) => {
  deployer.deploy(Election);
};
