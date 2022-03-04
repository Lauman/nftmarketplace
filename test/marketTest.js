const { expect } = require("chai");
const { ethers } = require("hardhat");

/* test/marketTest.js */
describe("NFTMarket", function () {
  let market;
  let nft;
  let token;
  const auctionPrice = ethers.utils.parseUnits("2.0", 18);
  let listingPrice;
  const tokenAmount = ethers.utils.parseUnits("80", "ether");

  it("Deploy the contracts", async function () {
    const [_, buyerAddress] = await ethers.getSigners();
    /* deploy the marketplace */
    const Market = await ethers.getContractFactory("NFTMarket");
    market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    /*Deploy Token from pay*/
    const Token = await ethers.getContractFactory("TokenLD");
    token = await Token.deploy("Token LD", "LD");
    await token.deployed();

    /*Transfer 80 LD Token to buyerAddress*/
    await token.transfer(
      buyerAddress.address,
      ethers.utils.parseUnits("80", "ether")
    );

    /*Aprove to market to spend token of buyerAddress*/
    await token
      .connect(buyerAddress)
      .approve(market.address, ethers.utils.parseUnits("80", "ether"));

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy(marketAddress);
    await nft.deployed();

    listingPrice = await market.getListingPrice();

    listingPrice = listingPrice.toString();

    /* create two tokens */
    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");

    /* put token for sale */
    await market.createMarketItem(nft.address, 1, auctionPrice, {
      value: listingPrice,
    });
    await market.createMarketItem(nft.address, 2, auctionPrice, {
      value: listingPrice,
    });

    /* execute sale of token to another user */
    await market
      .connect(buyerAddress)
      .createMarketSale(nft.address, 1, false, token.address, tokenAmount);

    /* query for and return the unsold items */
    items = await market.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );
    console.log("items: ", items);
  });
});
