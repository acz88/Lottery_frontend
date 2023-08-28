import { useEffect, useState } from "react";
import styles from "./instructionsComponent.module.css";
import { useAccount, useBalance, useContractRead, useNetwork, usePrepareSendTransaction, useSendTransaction } from "wagmi";
import tokenJson from '../../../backend/artifacts/contracts/LotteryToken.sol/LotteryToken.json';
import * as lotteryJson from '../../../backend/artifacts/contracts/Lottery.sol/Lottery.json';
import 'dotenv/config';
import { ethers } from 'ethers';
require('dotenv').config();

//let tokenContract = toString(process.env.TOKEN_ADDRESS) as const;
const TOKEN_ADDRESS = "0xCF085791030F5Fd071aF4e95b2eebcee2eaAdD98"

export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>
            Lottery<span> Dapp </span>
          </h1>
          <h3></h3>
        </div>
      </header>
      <br></br>
      <WalletInfo></WalletInfo>
      <br></br>
      <br></br>
      <PageBody></PageBody>
    </div>
  );
}

function PageBody() {
  return (
    <div className={styles.buttons_container}>
      <CheckState></CheckState>
    </div>
  )
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  if (address)
    return (
      <div>
        <p>Your account address is <b>{address}</b>.</p>
        <p>Connected to the <b>{chain?.name}</b> network.</p>
        <br></br>
        <WalletBalance address={address}></WalletBalance>
        <br></br>
        <TokenName></TokenName>
        <TokenBalance address={address}></TokenBalance>
        <br></br>
        <p><b> 1. Starting lottery: </b> </p>
        <br></br>
        <OpenLottery></OpenLottery>
        <br></br>
        <br></br>
        <p><b> 2. When lottery is open: </b> </p>
        <br></br>
        <BuyTokens></BuyTokens>
        <br></br>
        <br></br>
        <br></br>
        <div className={styles.buttons_container}>
            <Bet></Bet>
            <DisplayOwnerPool></DisplayOwnerPool> 
        </div>
        <br></br>
        <br></br>
        <BurnTokens></BurnTokens>
        <br></br>
        <br></br>
        <p><b> 3. Closing and claiming prize: </b> </p>
        <br></br>
        <div className={styles.buttons_container}>
        <CloseLottery></CloseLottery>
        </div>
        <br></br>
        <br></br>
        <WithdrawTokens></WithdrawTokens>
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Connecting wallet...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue.</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue.</p>
    </div>
  );
}

function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <p>Fetching balance…</p>;
  if (isError) return <p>Error fetching balance.</p>;
  return (
    <div>
      <p>Balance: <b>{data?.formatted} {data?.symbol}</b></p>
    </div>
  );
}

function TokenName() {
  const { data, isError, isLoading } = useContractRead({
    address: TOKEN_ADDRESS,
    abi: tokenJson.abi,
    functionName: "name",
  });

  const name = typeof data === "string" ? data : 0;

  if (isLoading) return <p>Fetching name…</p>;
  if (isError) return <p>Error fetching name.</p>;
  return <p>Token name: <b>{name}</b></p>;
}

function TokenBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useContractRead({
    address: TOKEN_ADDRESS,
    abi: tokenJson.abi,
    functionName: "balanceOf",
    args: [params.address],
  });

  const balance = typeof data === "bigint" ? data : 0;

  if (isLoading) return <p>Fetching balance...</p>;
  if (isError) return <p>Error fetching balance.</p>;
  return <p>Token balance: <b>{Number(balance)}</b> decimal units of <b>LotteryToken</b>.</p>;
}

function DisplayOwnerPool() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);

  if (!data) return (
    <button
        disabled={isLoading}
        className={styles.button}
        onClick={() => {
          setLoading(true);
          fetch("http://localhost:3001/display-owner-pool")
          .then((res) => res.json())
          .then((data) => {
            setData(data);
            setLoading(false)
          });
        }}
    >
      Display Owner Pool
    </button>
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <p>{data}</p>
    </div>
  );
}

function CheckState() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);

  if (!data) return (
    <button
        disabled={isLoading}
        className={styles.button}
        onClick={() => {
          setLoading(true);
          fetch("http://localhost:3001/check-state")
          .then((res) => res.json())
          .then((data) => {
            setData(data);
            setLoading(false)
          });
        }}
    >
     Check Lottery state
    </button>
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <p>{data}</p>
    </div>
  );
}

function BuyTokens() {
  const { config } = usePrepareSendTransaction();
  const { data, isLoading, isSuccess } = useSendTransaction(config);
  const [value, setValue] = useState("");

  if (isLoading) return <p>Requesting purchase from API...</p>;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value: value })
  };

  if (!data) return (
    <div>
      <form>
        <label>
          Enter eth value of tokens to purchase:
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)} 
          />
        </label>
      <button
        disabled={isLoading}
        onClick={() => fetch("http://localhost:3001/buy-tokens", requestOptions)}>
        Buy Tokens
      </button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      </form>
    </div>
  )
  return <></>
}

function WithdrawTokens() {
  const { config } = usePrepareSendTransaction();
  const { data, isLoading, isSuccess } = useSendTransaction(config);
  const [amount, setAmount] = useState("");

  if (isLoading) return <p>Requesting withdraw from API...</p>;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amount })
  };

  if (!data) return (
    <div>
      <form>
        <label>
          Enter amount of prize tokens to withdraw:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)} 
          />
        </label>
      <button
        disabled={isLoading} 
        onClick={() => fetch("http://localhost:3001/withdraw-tokens", requestOptions)}>
        Withdraw Tokens
      </button>
      {isLoading && <div>Check Wallet...</div>}
      {!isSuccess && isLoading && <div>Failure fetching withdrawal.</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      </form>
    </div>
  )
  return <></>
}

function OpenLottery() {
  const { config } = usePrepareSendTransaction();
  const { data, isLoading, isSuccess } = useSendTransaction(config);
  const [closingTime, setclosingTime] = useState("");


  if (isLoading) return <p>Requesting transfer from API...</p>;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ closingTime: closingTime })
  };


  if (!data) return (
    <><div>
      <form>
        <label>
          Enter UNIX end closing time to open lottery:
          <input
            type="number"
            value={closingTime}
            onChange={(e) => setclosingTime(e.target.value)} 
            />
        </label>
        <button
          //disabled={isLoading} 
          onClick={() => fetch("http://localhost:3001/open-bets", requestOptions)}>

          Open Bets

        </button>
        {isLoading && <div>Check Wallet</div>}
        {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
        </form>
      </div></>
    )
}


function CloseLottery() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);

  if (isLoading) return (
    <div>
      Loading...
    </div>
  )

  if (!data) return (
    <button
        disabled={isLoading}
        className={styles.button}
        onClick={() => {
          setLoading(true);
          fetch("http://localhost:3001/close-lottery")
          .then((res) => res.json())
          .then((data) => {
            setData(data);
            setLoading(false)
          });
        }}
    >
      Close Lottery
    </button>
  );

  return (
    <div>
      <p>{data}</p>
    </div>
  );
}

function Bet() {
  const [count, setCount] = useState(0);
  const [response, setResponse] = useState("");

  const placeBet = () => {
    fetch("http://localhost:3001/bet", {
      method: 'POST', // Adjust the HTTP method if needed
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.json())
    .then((data) => {
      setCount(count + 1);
      setResponse(data.message); // Assuming the response has a 'message' field
    })
    .catch((error) => {
      console.error('Error placing bet:', error);
    });
  };

  return (
    <div>
      <button 
       className={styles.button}
       onClick={placeBet}>PLACE BET</button>
      <p>Number of bets placed: {count}</p>
    </div>
  );
}

function BurnTokens() {
  const { config } = usePrepareSendTransaction();
  const { data, isLoading, isSuccess } = useSendTransaction(config);
  const [amount, setAmount] = useState("");

  if (isLoading) return <p>Requesting burn from API...</p>;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amount })
  };

  if (!data) return (
    <div>
      <form>
        <label>
          Enter amount of tokens to burn:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)} 
          />
        </label>
      <button
        disabled={isLoading} 
        onClick={() => fetch("http://localhost:3001/burn-tokens", requestOptions)}>
        Burn Tokens
      </button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      </form>
    </div>
  )
  return <></>
}