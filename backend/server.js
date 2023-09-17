const express = require('express');
const { ethers } = require('ethers');
const axios = require('axios');
const abi = require('../artifacts/contracts/ERC20Factory.sol/ERC20Factory.json')
const ercAbi = require('../artifacts/contracts/CustomERC20.sol/CustomERC20.json')
require('dotenv').config({path: '../.env'})
const fs = require('fs');
const qs = require('qs');

const erc = fs.readFileSync('../FlattenedERC20.sol', 'utf8');


const app = express();
const PORT = 3001;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const PROVIDER_URL = process.env.SEPOLIA_RPC; // Replace with your Infura URL or other Ethereum provider.
const CONTRACT_ADDRESS = '0xc8575D5ee74443bEB0A5088723c1a3598Be1583a';
const CONTRACT_ABI = abi.abi;  // Replace with your contract's ABI.

const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    watchEvents();
});

function watchEvents() {
    contract.on("TokenCreated", async (tokenAddress, name, symbol, initialSupply) => { // Adjust event arguments accordingly.

        try {
            console.log(`Event detected, attempting verification on ${tokenAddress}...`)
            const iface = new ethers.Interface(ercAbi.abi);
            const args = iface.encodeDeploy([name, symbol, ethers.parseEther(`${initialSupply}`)]).slice(2);
            await sleep(30000)
            await verifyOnEtherscan(tokenAddress, args);
        } catch (error) {
            console.error("Failed to verify contract:", error);
        }
    });
}

async function verifyOnEtherscan(tokenAddress, args) {

    const verificationData = {
        apikey: process.env.ETHERSCAN_KEY,
        module: 'contract',
        action: 'verifysourcecode',
        sourceCode: erc,
        contractaddress: tokenAddress,
        codeformat: 'solidity-single-file',
        contractname:'CustomERC20',
        compilerversion: 'v0.8.19+commit.7dd6d404',
        optimizationUsed: 0,
        constructorArguements: args
    };

    await axios.post('https://api-sepolia.etherscan.io/api', qs.stringify(verificationData), {
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // or 'application/json'
    }
    });

    // Handle the response. Etherscan API might require polling to check verification status.
    console.log(`Verification succeeded! Check out your coin on https://sepolia.etherscan.io/token/${tokenAddress}`);
}
