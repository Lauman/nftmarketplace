/* pages/create-item.js */
import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Web3Modal from "web3modal";
import { useNavigate } from "react-router-dom";
import { InputMask } from "primereact/inputmask";
import clientIpfs from "../auth/ipfs";
import backgroundImage from "../assets/background.jpg";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/Market.sol/NFTMarket.json";
import mergeImages from "merge-images";

const CreateItem = () => {
  //const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
  let navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "0.0000000000000000",
    name: "",
    description: "",
  });
  const [imagesArray, setImageArray] = useState([]);
  const [imageInput, setImageInput] = useState(true);
  const { name, description, price } = formInput;
  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await clientIpfs.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  const mergeImage = () => {
    mergeImages([
      `${imagesArray[0]}`,
      `${imagesArray[1]}`,
      `${imagesArray[2]}`,
      `${imagesArray[3]}`,
    ]).then((b64) => setFileUrl(b64));
  };

  function getBase64(e) {
    const file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setImageArray((imagesArray) => [...imagesArray, reader.result]);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  async function createMarket() {
    const { name, description, price } = formInput;
    //console.log(name, description, price, fileUrl);
    if (!name || !description || !price || !fileUrl) return;

    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await clientIpfs.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      createSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(
      process.env.REACT_APP_NFTADDRESS,
      NFT.abi,
      signer
    );
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, "ether");

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(
      process.env.REACT_APP_NFTMARKETADDRES,
      Market.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(
      process.env.REACT_APP_NFTADDRESS,
      tokenId,
      price,
      {
        value: listingPrice,
      }
    );
    await transaction.wait();
    navigate("/galery");
  }

  return (
    <>
      <div
        className="flex justify-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="w-1/2 flex flex-col pb-12">
          <input
            placeholder="Asset Name"
            className="mt-8 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
          <textarea
            placeholder="Asset Description"
            className="mt-2 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
          <InputMask
            mask="9.999999999999999999"
            placeholder="Asset Price in Eth"
            className="mt-2 border rounded p-4"
            value={price}
            onChange={(e) =>
              updateFormInput({ ...formInput, price: e.target.value })
            }
          ></InputMask>

          <div
            className="mt-2 border rounded p-4"
            style={{ backgroundColor: "white" }}
          >
            <div>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="radio"
                  value="1"
                  onChange={() => setImageInput(true)}
                />
                <span className="ml-2">Single image</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  onChange={() => setImageInput(false)}
                  className="form-radio"
                  name="radio"
                  value="2"
                />
                <span className="ml-2">Create a avatar</span>
              </label>
            </div>
          </div>

          {imageInput ? (
            <div
              className="mt-2 border rounded p-4"
              style={{ backgroundColor: "white" }}
            >
              <p>Select the image</p>
              <input
                type="file"
                name="Asset"
                className="my-4"
                onChange={onChange}
              />
              <br></br>
            </div>
          ) : (
            <div className="flex flex-wrap">
              <div
                className="mt-2 border rounded p-4"
                style={{ backgroundColor: "white" }}
              >
                <p>Hair</p>
                <input
                  type="file"
                  name="Asset"
                  className="my-4"
                  onChange={getBase64}
                />
                <br></br>
              </div>
              <div
                className="mt-2 border rounded p-4"
                style={{ backgroundColor: "white" }}
              >
                <p>Face</p>
                <input
                  type="file"
                  name="Asset"
                  className="my-4"
                  onChange={getBase64}
                />
                <br></br>
              </div>
              <div
                className="mt-2 border rounded p-4"
                style={{ backgroundColor: "white" }}
              >
                <p>Eyes</p>
                <input
                  type="file"
                  name="Asset"
                  className="my-4"
                  onChange={getBase64}
                />
                <br></br>
              </div>
              <div
                className="mt-2 border rounded p-4"
                style={{ backgroundColor: "white" }}
              >
                <p>Mouth</p>
                <input
                  type="file"
                  name="Asset"
                  className="my-4"
                  onChange={getBase64}
                />
              </div>
            </div>
          )}

          <br></br>
          {!imageInput ? (
            <button
              onClick={() => mergeImage()}
              className="font-bold mt-4 bg-indigo-500 text-white rounded p-4 shadow-lg"
            >
              Merge images
            </button>
          ) : null}

          <br></br>

          {fileUrl ? (
            <div className="w-1/2 flex flex-col pb-12">
              <img className="rounded mt-4" width="350" src={fileUrl} />
            </div>
          ) : null}
          <button
            onClick={() => createMarket()}
            className="font-bold mt-4 bg-indigo-500 text-white rounded p-4 shadow-lg"
          >
            Create Digital Asset
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateItem;
