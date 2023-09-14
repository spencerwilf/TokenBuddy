// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;
import "hardhat/console.sol";
import { CustomERC20 } from "./CustomERC20.sol";

contract ERC20Factory {

    address[] public deployedTokens;
    mapping(address => address[]) public userTokens;

    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        uint initialSupply
    );

    function createToken(string memory _name, string memory _symbol, uint _initialSupply) external returns(address) {
        CustomERC20 newToken = new CustomERC20(_name, _symbol, _initialSupply);

        newToken.transfer(msg.sender, _initialSupply);

        deployedTokens.push(address(newToken));
        userTokens[msg.sender].push(address(newToken));

        emit TokenCreated(address(newToken), _name, _symbol, _initialSupply);

        return address(newToken);
    }
    
    function getUserTokens() public view returns(address[] memory) {
        return userTokens[msg.sender];
    }
}
