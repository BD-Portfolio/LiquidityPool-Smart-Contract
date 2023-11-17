const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LiquidityPool contract test cases", function () {
  let depositToken;
  let liquidityPool;
  let lpToken;
  let owner;
  let user;

  // Deploy the contracts and get account addresses before each test
  beforeEach(async function () {
    // fetch the accounts
    [owner, user] = await ethers.getSigners();
    console.log("Account addresses :- ", owner.address, user.address);

    // deploy deposit token contract
    const DepositToken = await ethers.getContractFactory("DepositToken");
    depositToken = await DepositToken.deploy(
      "DepositToken",
      "DT",
      ethers.utils.parseEther("500000")
    );

    await depositToken.deployed();
    console.log(
      "DepositToken contract deployed at address :- ",
      depositToken.address
    );

    // deploy liquidity pool contract
    const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
    liquidityPool = await LiquidityPool.deploy(
      depositToken.address,
      "LPToken",
      "LT"
    );
    console.log(
      "Liquidity Pool contract deployed at address :- ",
      liquidityPool.address
    );

    const LPToken = await ethers.getContractFactory("LPToken");
    lpToken = LPToken.attach(await liquidityPool.lpToken());
    console.log("LP Token contract deployed at address :- ", lpToken.address);
  });

  it("Should deposit ERC20(DepositToken) successfully", async function () {
    const depositAmount = ethers.utils.parseEther("100");
    await depositToken.approve(liquidityPool.address, depositAmount);
    await liquidityPool.deposit(depositAmount);

    const contractBalance = await depositToken.balanceOf(liquidityPool.address);
    expect(contractBalance).to.equal(depositAmount);
  });

  it("Should increase total liquidity after a successful deposit", async function () {
    const depositAmount = ethers.utils.parseEther("100");
    await depositToken.approve(liquidityPool.address, depositAmount);
    await liquidityPool.deposit(depositAmount);

    const totalLiquidity = await liquidityPool.liquidityFunds();
    expect(totalLiquidity).to.equal(depositAmount);
  });

  it("Should increase the user's liquidity balance after a successful deposit", async function () {
    const depositAmount = ethers.utils.parseEther("100");
    await depositToken.approve(liquidityPool.address, depositAmount);
    await liquidityPool.deposit(depositAmount);

    const userLiquidityBalance = await liquidityPool.userDeposits(
      owner.address
    );
    expect(userLiquidityBalance).to.equal(depositAmount);
  });

  it("Should mint & transfer LP tokens to the user's address after a successful deposit", async function () {
    const depositAmount = ethers.utils.parseEther("100");
    await depositToken.approve(liquidityPool.address, depositAmount);
    await liquidityPool.deposit(depositAmount);

    const userLPBalance = await lpToken.balanceOf(owner.address);
    expect(userLPBalance).to.equal(depositAmount);
  });

  it("Should not allow a user to deposit zero amount of DepositToken", async function () {
    const invalidDepositAmount = 0;
    await expect(liquidityPool.deposit(invalidDepositAmount)).to.be.reverted;
  });

  it("Should allow a user to successfully withdraw DepositToken", async function () {
    const depositAmount = ethers.utils.parseEther("100");
    await depositToken.approve(liquidityPool.address, depositAmount);
    await liquidityPool.deposit(depositAmount);

    const lpBalanceBefore = await lpToken.balanceOf(owner.address);
    const contractBalanceBefore = await depositToken.balanceOf(
      liquidityPool.address
    );
    const userBalanceBefore = await depositToken.balanceOf(owner.address);

    await liquidityPool.withdraw(lpBalanceBefore);

    const lpBalanceAfter = await lpToken.balanceOf(owner.address);
    const contractBalanceAfter = await depositToken.balanceOf(
      liquidityPool.address
    );
    const userBalanceAfter = await depositToken.balanceOf(owner.address);

    expect(lpBalanceAfter).to.equal(0);
    expect(contractBalanceAfter).to.equal(
      contractBalanceBefore.sub(lpBalanceBefore)
    );
    expect(userBalanceAfter).to.equal(userBalanceBefore.add(lpBalanceBefore));
  });

  it("Should not allow a user to withdraw more LP tokens than they have", async function () {
    const depositAmount = ethers.utils.parseEther("100");
    await depositToken.approve(liquidityPool.address, depositAmount);
    await liquidityPool.deposit(depositAmount);

    const lpBalance = await lpToken.balanceOf(owner.address);
    await expect(liquidityPool.withdraw(lpBalance.add(1))).to.be.reverted;
  });

  it("Should not allow a user to withdraw zero amount of LP tokens", async function () {
    await expect(liquidityPool.withdraw(0)).to.be.reverted;
  });

  it("should emit Deposited and Withdrawn events", async function () {
    // Deposit ERC20 tokens into the liquidity pool
    const depositAmount = ethers.utils.parseEther("100");
    await depositToken.approve(liquidityPool.address, depositAmount);
    const depositTx = await liquidityPool.deposit(depositAmount);

    // Withdraw ERC20 tokens from the liquidity pool
    const withdrawAmount = ethers.utils.parseEther("50");
    const withdrawTx = await liquidityPool.withdraw(withdrawAmount);

    // Check events emitted
    expect(depositTx).to.emit(liquidityPool, "Deposited");
    expect(withdrawTx).to.emit(liquidityPool, "Withdrawn");
  });

  it("Should not allow non-owners to mint LP tokens", async function () {
    const mintAmount = ethers.utils.parseEther("100");
    await expect(lpToken.mint(user.address, mintAmount)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("Should not allow non-owners to burn LP tokens", async function () {
    const burnAmount = ethers.utils.parseEther("50");
    await expect(lpToken.burn(user.address, burnAmount)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });
});
