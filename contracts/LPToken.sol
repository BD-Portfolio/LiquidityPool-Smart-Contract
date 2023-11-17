// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * This is LP token contract
 * LP tokens are minted when users deposit StakingToken into the liquidity pool
 * LP tokens are burned when users withdraw their tokens from the pool
 */
contract LPToken is ERC20, Ownable {
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) Ownable() {}

    /**
     * This function is used to mint tokens and can only be called by the Liquidity Pool contract
     */
    function mint(address _account, uint256 _amount) external onlyOwner {
        _mint(_account, _amount);
    }

    /**
     * This function is used to burn tokens and can only be called by the Liquidity Pool contract
     */
    function burn(address _account, uint256 _amount) external onlyOwner {
        _burn(_account, _amount);
    }
}
