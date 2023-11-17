// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * The contract is ERC20 token named as DepositToken and symobol is DT
 * It is used to to stake in liquidity pool
 */
contract DepositToken is ERC20, ERC20Burnable {
    /**
     * Sets the name & symbol of the token, and mints tokens at time of deployment
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, _initialSupply);
    }

    /**
     * This function can only be called only by anyone to mint tokens
     * so that they can mint and test liquidity pool deposit & withdraw
     */
    function mintTokens(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}
