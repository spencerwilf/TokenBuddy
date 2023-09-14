const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
 
  const factory = await hre.ethers.deployContract('ERC20Factory')
  await factory.waitForDeployment()
  console.log(`Deployed at ${factory.target}`)

  await sleep(20 * 1000);

  await hre.run("verify:verify", {
    address: factory.target,
    constructorArguments: [],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
