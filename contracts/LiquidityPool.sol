// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./LPToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * This is Liquidity pool contract
 * It allows users to deposit ERC20 tokens and receive LP tokens
 * Users can withdraw their tokens by burning their LP tokens
 */
contract LiquidityPool {
    using SafeMath for uint256;

    event Deposited(
        address indexed account,
        uint256 indexed lpTokensMinted,
        uint256 indexed depositedAmount
    );
    event Withdrawn(
        address indexed account,
        uint256 indexed lpTokensBurned,
        uint256 indexed withdrawnAmount
    );

    LPToken public lpToken;
    address public depositTokenAddress;
    uint256 public liquidityFunds;

    mapping(address => uint256) public userDeposits;

    /**
     * Checks invalid amount
     */
    modifier onlyValidAmount(uint256 _amount) {
        require(_amount > 0, "Amount should be greater than 0");
        _;
    }

    /**
     * Sets the LP token name, symbol & deposit token address
     */
    constructor(
        address _depositTokenAddress,
        string memory _lpTokenName,
        string memory _lpTokenSymbol
    ) {
        depositTokenAddress = _depositTokenAddress;
        lpToken = new LPToken(_lpTokenName, _lpTokenSymbol);
    }

    /**
     * Deposits tokens into the liquidity pool & mints LP tokens
     */
    function deposit(uint256 _amount) external onlyValidAmount(_amount) {
        require(
            IERC20(depositTokenAddress).allowance(msg.sender, address(this)) >=
                _amount,
            "Approval pending"
        );

        require(
            IERC20(depositTokenAddress).transferFrom(
                msg.sender,
                address(this),
                _amount
            ),
            "Failed to transfer deposit tokens"
        );

        // amount added as liquidity
        userDeposits[msg.sender] = userDeposits[msg.sender].add(_amount);

        // update the liquidity of pool
        liquidityFunds = liquidityFunds.add(_amount);

        // mint LP tokens to the user's address
        lpToken.mint(msg.sender, _amount);

        emit Deposited(msg.sender, _amount, _amount);
    }

    /**
     * Withdraws deposit tokens & burns corresponding LP tokens
     */
    function withdraw(uint256 _amount) external onlyValidAmount(_amount) {
        require(
            userDeposits[msg.sender] >= _amount,
            "Amount is greater than deposited tokens"
        );

        require(
            lpToken.balanceOf(msg.sender) >= _amount,
            "Insufficient LP tokens"
        );

        require(
            IERC20(depositTokenAddress).balanceOf(address(this)) >= _amount,
            "Insufficient deposit tokens holded by the contract"
        );

        // deduct the amount that is burnt
        liquidityFunds = liquidityFunds.sub(_amount);

        // deduct the amount returned back
        userDeposits[msg.sender] = userDeposits[msg.sender].sub(_amount);

        // burn LP tokens
        lpToken.burn(msg.sender, _amount);

        // transfer the deposit tokens back to the user
        require(
            IERC20(depositTokenAddress).transfer(msg.sender, _amount),
            "Failed to transfer back deposit tokens"
        );

        emit Withdrawn(msg.sender, _amount, _amount);
    }
}