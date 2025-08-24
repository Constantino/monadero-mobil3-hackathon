// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title MSALDOSTORE
 * @dev A contract that allows users to buy MSAL tokens in exchange for ETH
 * The contract receives MSALDO tokens and sells them for ETH
 */
contract MSALDOSTORE is Ownable, ReentrancyGuard, Pausable {
    // MSALDO token contract
    ERC20 public immutable msaldoToken;

    // Price of 1 MSAL token in ETH (in wei)
    uint256 public msalPriceInEth;

    // Minimum purchase amount in MSAL tokens
    uint256 public minPurchaseAmount;

    // Maximum purchase amount in MSAL tokens
    uint256 public maxPurchaseAmount;

    // Total ETH received from sales
    uint256 public totalEthReceived;

    // Total MSAL tokens sold
    uint256 public totalMsalSold;

    // Events
    event MsalTokensPurchased(
        address indexed buyer,
        uint256 ethAmount,
        uint256 msalAmount
    );
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);
    event PurchaseLimitsUpdated(uint256 minAmount, uint256 maxAmount);
    event TokensWithdrawn(address indexed owner, uint256 amount);
    event EthWithdrawn(address indexed owner, uint256 amount);

    /**
     * @dev Constructor
     * @param _msaldoToken Address of the MSALDO token contract
     * @param _msalPriceInEth Price of 1 MSAL token in ETH (in wei)
     * @param _minPurchaseAmount Minimum purchase amount in MSAL tokens
     * @param _maxPurchaseAmount Maximum purchase amount in MSAL tokens
     */
    constructor(
        address _msaldoToken,
        uint256 _msalPriceInEth,
        uint256 _minPurchaseAmount,
        uint256 _maxPurchaseAmount
    ) Ownable(msg.sender) {
        require(_msaldoToken != address(0), "Invalid token address");
        require(_msalPriceInEth > 0, "Price must be greater than 0");
        require(_minPurchaseAmount > 0, "Min purchase must be greater than 0");
        require(
            _maxPurchaseAmount > _minPurchaseAmount,
            "Max must be greater than min"
        );

        msaldoToken = ERC20(_msaldoToken);
        msalPriceInEth = _msalPriceInEth;
        minPurchaseAmount = _minPurchaseAmount;
        maxPurchaseAmount = _maxPurchaseAmount;
    }

    /**
     * @dev Buy MSAL tokens with ETH
     * @param msalAmount Amount of MSAL tokens to buy
     */
    function buyMsalTokens(
        uint256 msalAmount
    ) external payable nonReentrant whenNotPaused {
        require(msalAmount >= minPurchaseAmount, "Amount below minimum");
        require(msalAmount <= maxPurchaseAmount, "Amount above maximum");

        uint256 requiredEth = msalAmount * msalPriceInEth;
        require(msg.value >= requiredEth, "Insufficient ETH sent");

        // Check if contract has enough MSALDO tokens
        uint256 contractBalance = msaldoToken.balanceOf(address(this));
        require(
            contractBalance >= msalAmount,
            "Insufficient MSALDO tokens in contract"
        );

        // Transfer MSALDO tokens to buyer
        require(
            msaldoToken.transfer(msg.sender, msalAmount),
            "Token transfer failed"
        );

        // Update totals
        totalEthReceived += requiredEth;
        totalMsalSold += msalAmount;

        // Refund excess ETH if any
        if (msg.value > requiredEth) {
            uint256 excess = msg.value - requiredEth;
            (bool success, ) = payable(msg.sender).call{value: excess}("");
            require(success, "ETH refund failed");
        }

        emit MsalTokensPurchased(msg.sender, requiredEth, msalAmount);
    }

    /**
     * @dev Get the ETH cost for a given amount of MSAL tokens
     * @param msalAmount Amount of MSAL tokens
     * @return ethCost Cost in ETH (wei)
     */
    function getEthCost(
        uint256 msalAmount
    ) external view returns (uint256 ethCost) {
        return msalAmount * msalPriceInEth;
    }

    /**
     * @dev Get the MSAL token amount for a given ETH amount
     * @param ethAmount Amount of ETH (wei)
     * @return msalAmount Amount of MSAL tokens
     */
    function getMsalAmount(
        uint256 ethAmount
    ) external view returns (uint256 msalAmount) {
        return ethAmount / msalPriceInEth;
    }

    /**
     * @dev Update the price of MSAL tokens
     * @param newPrice New price in ETH (wei)
     */
    function updatePrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be greater than 0");
        uint256 oldPrice = msalPriceInEth;
        msalPriceInEth = newPrice;
        emit PriceUpdated(oldPrice, newPrice);
    }

    /**
     * @dev Update purchase limits
     * @param newMinAmount New minimum purchase amount
     * @param newMaxAmount New maximum purchase amount
     */
    function updatePurchaseLimits(
        uint256 newMinAmount,
        uint256 newMaxAmount
    ) external onlyOwner {
        require(newMinAmount > 0, "Min amount must be greater than 0");
        require(newMaxAmount > newMinAmount, "Max must be greater than min");
        minPurchaseAmount = newMinAmount;
        maxPurchaseAmount = newMaxAmount;
        emit PurchaseLimitsUpdated(newMinAmount, newMaxAmount);
    }

    /**
     * @dev Withdraw MSALDO tokens from contract (owner only)
     * @param amount Amount to withdraw
     */
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(
            msaldoToken.transfer(owner(), amount),
            "Token withdrawal failed"
        );
        emit TokensWithdrawn(owner(), amount);
    }

    /**
     * @dev Withdraw ETH from contract (owner only)
     * @param amount Amount to withdraw
     */
    function withdrawEth(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= address(this).balance, "Insufficient ETH balance");

        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "ETH withdrawal failed");

        emit EthWithdrawn(owner(), amount);
    }

    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Get contract statistics
     * @return tokenBalance Current MSALDO token balance
     * @return ethBalance Current ETH balance
     * @return totalSold Total MSAL tokens sold
     * @return totalReceived Total ETH received
     */
    function getContractStats()
        external
        view
        returns (
            uint256 tokenBalance,
            uint256 ethBalance,
            uint256 totalSold,
            uint256 totalReceived
        )
    {
        return (
            msaldoToken.balanceOf(address(this)),
            address(this).balance,
            totalMsalSold,
            totalEthReceived
        );
    }

    /**
     * @dev Emergency function to recover accidentally sent tokens (owner only)
     * @param tokenAddress Address of the token to recover
     * @param amount Amount to recover
     */
    function emergencyRecoverToken(
        address tokenAddress,
        uint256 amount
    ) external onlyOwner {
        require(
            tokenAddress != address(msaldoToken),
            "Cannot recover MSALDO tokens"
        );
        require(tokenAddress != address(0), "Invalid token address");

        ERC20 token = ERC20(tokenAddress);
        require(token.transfer(owner(), amount), "Token recovery failed");
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {
        // Contract can receive ETH
    }

    /**
     * @dev Fallback function
     */
    fallback() external payable {
        // Contract can receive ETH
    }
}
