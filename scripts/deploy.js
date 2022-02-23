const main = async () => {
  const extension = "lambomoon";
  const domain = "flo";
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy(extension);
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);

  let txn = await domainContract.register(domain, { value: hre.ethers.utils.parseEther('0.1') });
  await txn.wait();
  console.log(`Minted domain ${domain}.${extension}`);

  txn = await domainContract.setRecord(domain, "Florian Bouron");
  await txn.wait();
  console.log(`Set record for ${domain}.${extension}`);

  const address = await domainContract.getAddress(domain);
  console.log(`Owner of domain ${domain}:`, address)

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
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