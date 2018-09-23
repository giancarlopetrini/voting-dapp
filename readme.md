# voting-dapp

Initial basic app using truffle.js framework for election/voting with solidity contracts. 

### Tons of credit to: Dapp University's tutorials

http://www.dappuniversity.com/articles/the-ultimate-ethereum-dapp-tutorial

### Initialize the project
1. Install the truffle framework `npm install -g truffle`
2. Install the ganache gui or cli `npm install -g ganache-cli`
3. `git clone https://github.com/giancarlopetrini/voting-dapp && cd voting-dapp && npm install`
4. In the background, simply run `ganache-cli`, the accounts/private keys will be generated and an in memory ETH blockchain will start.

### Run Test
1. To add aditional tests, edit the `test/election.js` file.
2. From project root (make sure ganache-cli is running) run `truffle test`. If all passes, you're ready to deploy.

### Deploy Contracts
1. The deploy methods have been added to `/migrations/` and will be run in the order specified. e.g. `1_ 2_ ...`. To deploy (run a migration), from project root, run `tuffle migrate`.
2. If making changes to existing contracts, like adding an additional struct to a function that's been deployed, you'll need to run `truffle migrate -reset` for it work properly.

### Start Server
1. `npm run dev` from project root will open `localhost:3000`. 

### Cast Vote
1. Ensure Metamask is installed, and pop ups are not blocked. Within Metamask, click your accounts' icon to access the menu, and select `import account`.
2. Copy one of the seeds that `ganache-cli` spit out upon starting it and paste it into Metamask. You've now loaded your Ethers in Metamask.
3. Make a candidate selection and vote. Your results should be displayed. Continue, importing other accounts, as needed.