const main = async () => {
  const domainToRegister = "flo";

  // The first return is the deployer, the second is a random account
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy("lambomoon");
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);
  console.log("Contract deployed by:", owner.address);

  // We send money to the contract - We give more than expected
  let txn = await domainContract.register(domainToRegister, { value: hre.ethers.utils.parseEther('1234') });
  await txn.wait();

  const domainAddress = await domainContract.getAddress(domainToRegister);
  console.log(`Owner of domain ${domainToRegister}: ${domainAddress}`);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

  try {
    txn = await domainContract.connect(randomPerson).withdraw();
    await txn.wait();
  } catch (error) {
    console.log("Could not rob contract");
  }

  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log("Balance of owner before withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

  txn = await domainContract.connect(owner).withdraw();
  await txn.wait();

  const contractBalance = await hre.ethers.provider.getBalance(domainContract.address);
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log("Contract balance after withdrawal:", hre.ethers.utils.formatEther(contractBalance));
  console.log("Balance of owner after withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

  // Get an error
  // await domainContract.register("12345678901234", { value: hre.ethers.utils.parseEther('1234') });

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