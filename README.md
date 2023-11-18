# LiquidityPool-Smart-Contract

## Description:
 
Its a hardhat project that contains LiquidityPool contract, DepositToken contract and LPToken contract. It supports minting deposit token and then test deposit ERC20 tokens & get LP tokens and then withdraw them.

### Important Points :

- Mint DepositToken
- Stake DepositToken & get LPToken
- Withdraw DepositToken & burn LPToken

### Techologies Used:

- Hardhat
- Solidity

### List of Libraries/Framework used:

- Mocha
- Chai
- Ethers
- Web3
- Openzepplin
- BigNumber

### Directory layout
       
├── contracts                                      
├── scripts                   
├── test             
└── README.md

### How to install and run :

- Run `npm install` to install all dependencies

- Run `npx hardhat compile` to compile all the contracts

- Run `npx hardhat run scripts/deploy-script.js` to deploy all the contracts

### Run Test Cases :

- Run `npx hardhat test` to execute all the testcases of the contracts
