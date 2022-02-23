const main = async () => {
  const domainToRegister = "flo";

  // The first return is the deployer, the second is a random account
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy("lambomoon");
  await domainContract.deployed();
  console.log("Contract deployed to:", domainContract.address);
  console.log("Contract deployed by:", owner.address);

  // We send money to the contract
  let txn = await domainContract.register(domainToRegister, { value: hre.ethers.utils.parseEther('0.1') });
  await txn.wait();

  const domainAddress = await domainContract.getAddress(domainToRegister);
  console.log(`Owner of domain ${domainToRegister}: ${domainAddress}`);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

  // Trying to set a record that doesn't belong to me!
  // console.log("Trying to steal a record");
  // txn = await domainContract.connect(randomPerson).setRecord(domainToRegister, "Haha my domain now!");
  // await txn.wait();
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();