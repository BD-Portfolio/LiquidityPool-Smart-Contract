const hre = require("hardhat");

async function main() {
  // fetch different accounts
  [firstUser] = await ethers.getSigners();
  console.log(`Deploying contract with the account :- ${firstUser.address}`);

  // deploy Deposit token contract
  const DepositTokenContract = await hre.ethers.getContractFactory(
    "DepositToken"
  );

  const DepositToken = await DepositTokenContract.deploy(
    "DepositToken",
    "DT",
    hre.ethers.utils.parseEther("500000")
  );

  await DepositToken.deployed();
  console.log(`DepositToken contract deployed at :- ${DepositToken.address}`);

  // deploy Liquidity Pool contract
  const LiquidityPoolContract = await hre.ethers.getContractFactory(
    "LiquidityPool"
  );

  const LiquidityPool = await LiquidityPoolContract.deploy(
    DepositToken.address,
    "LPToken",
    "LT"
  );

  await LiquidityPool.deployed();
  console.log(`LiquidityPool contract deployed at :- ${LiquidityPool.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
