import React, { useContext } from "react";
import Web3Modal from "web3modal";
import AuthContext from "../auth/context";
import logoMeta from "../assets/metamaskLogo.jpg";
import vaporWave from "../assets/Vaporwave2.jpg";
const Home = () => {
  const authContext = useContext(AuthContext);
  const ConectToMeta = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    authContext.setAccount(account);
  };
  return (
    <>
      <main>
        {authContext.account ? (
          <div className="flex flex-wrap justify-center">
            <img src={vaporWave} />
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap justify-center">
              <p>Select a Metamask wallet to enter</p>
              <br></br>
            </div>
            <div
              className="flex flex-wrap justify-center"
              onClick={() => ConectToMeta()}
            >
              <img src={logoMeta} style={{ height: "100px" }} />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
