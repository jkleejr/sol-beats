import React, { useEffect, useState } from 'react';
import Item from "../components/item";

import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';


import dynamic from "next/dynamic";

const TWITTER_HANDLE = `jkw129`;
const TWITTER_LINK = `https://twitter.com/jkw129`;


const App = () => {
  // user key from supported wallets
  const { publicKey } = useWallet();
  const [items, setItems] = useState([]);

  // endpoint and Item components
  useEffect(() => {
    if(publicKey) {
      fetch(`api/fetchItems`)
        .then(response => response.json())
        .then(data => {
          setItems(data);
          console.log("Items", data);
        });
    }
  },
  [publicKey]);

  // prevent hydration error
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
  );

  const renderNotConnectedContainer = () => (
    <div>
      <img src="https://media.giphy.com/media/eSwGh3YK54JKU/giphy.gif" alt="emoji" />
      <div className="button-container">
        <WalletMultiButtonDynamic className= "cta-button connect-wallet-button" />
      </div>
    </div>
  );

  const renderItemBuyContainer = () => (
    <div className = "items-container">
      {items.map((item) => (
      <Item key={item.id} item= {item} />
      ))}
    </div>
  );
  
  
  return (
    <div className="App">
      <div className="container">
        <header className="header-container">
          <p className="header"> Yooo! </p>
          <p className="sub-text"> testing... connect key </p>
        </header>

        <main>
          {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()}
        </main>
        
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src="twitter-logo.svg" />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

