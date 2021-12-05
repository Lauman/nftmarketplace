1. To install all dependences run command: yarn
2. Run npx hardhat compile
3. Run npx hardhat node
4. Run npx harhat run scripts/deploy.js --network localhost
5. With the contract deployed, create a .env file in root folder with the variables: 
   * REACT_APP_NFTMARKETADDRES => Marketplace address
   * REACT_APP_NFTADDRESS => Contract address for create a NFTs
   * REACT_APP_IPFS_PROJECT_ID => Id of endpoint Infura IPFS
   * REACT_APP_IPFS_PROJECT_SECRET => Secret of endpoint Infura IPFS
6- Run the proyect with the command: yarn start
