import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Joker from './Joker';
import './App.css';

function App() {
  const [web3, setweb3] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    async function loadWeb3() {
      if(window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        setweb3(web3);
      } else if (window.web3){
        setweb3(new Web3(window.web3.currentProvider));
      } else {
        console.log('Error');
      }
    }

    async function loadBlockchainData() {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const networkData = Joker.networks[networkId];

      if (networkData) {
        const token = new web3.eth.Contract(Joker.abi, networkData.address);
        let balance = await token.methods.balanceOf(accounts[0]).call();
        setBalance(balance.totring());
      } else {
        window.alert('Token is not deployeted');
      }
    }

    if (web3) {
      loadBlockchainData();
    } else {
      loadWeb3();
    }

  }, [web3]);
  
  const transferTokens = async (recipient, amount) => {
    
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Joker SWAP</h2>
        <p>Your account: {account}</p>
        <p>Your balance: {balance}</p>

        <h3>Transfer tokens</h3>

        <form onSubmitCapture={(e) => {
          e.preventDefault();
          transferTokens(recipient, amount);
        }}>
          <div>
            <label>Address:</label>

            <input type="text" value={recipient} 
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div>
            <label>Total:</label>

            <input type="text" value={amount}
              onChange={(e) => setAmount(e.target.value)}
            ></input>
          </div>
        </form>
      </header>
    </div>
  )
}

export default App;