import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { contractAddress } from "../constants/address";

const { Web3, TxType } = require("@kaiachain/web3js-ext");

import { useConnectWallet } from "@web3-onboard/react";

const buttonStyles = {
  borderRadius: "6px",
  background: "#111827",
  border: "none",
  fontSize: "18px",
  fontWeight: "600",
  cursor: "pointer",
  color: "white",
  padding: "14px 12px",
  marginTop: "40px",
  fontFamily: "inherit",
};

export default function Home() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  // Create a Web3 provider instance
  let web3Provider;

  if (wallet) {
    web3Provider = new Web3(wallet.provider);
  }

  async function mintNFT() {
    setError("");
    setTxHash("");
    console.log("====== Minting Wave Form NFT ======");

    try {
      if (!wallet || !wallet.provider) {
        throw new Error("Wallet not connected");
      }

      const web3Provider = new Web3(wallet.provider);

      const accounts = await web3Provider.eth.getAccounts();
      const account = accounts[0];
      console.log("Using account:", account);

      const contractAbi = JSON.parse(
        '[{"inputs": [],"name": "mint","outputs": [],"stateMutability": "nonpayable","type": "function"}]'
      );

      const contract = new web3Provider.eth.Contract(
        contractAbi,
        contractAddress
      );
      const data = contract.methods.mint().encodeABI();

      const tx = {
        type: TxType.FeeDelegatedSmartContractExecution,
        from: account,
        to: contractAddress,
        data: data,
        gas: 500000, // Specify a gas limit
      };

      console.log("Transaction object:", tx);

      // Sign the transaction
      const signedTx = await web3Provider.eth.signTransaction(tx);
      console.log("Signed transaction:", signedTx);

      // Send the signed transaction to our fee delegation server
      const API_URL =
        process.env.NODE_ENV === "production"
          ? "https://kaia-gas-abstraction.vercel.app/api/feedelegation"
          : "http://localhost:3000/api/feedelegation";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rawTransaction: signedTx.raw }),
      });

      const result = await response.json();

      // Your existing logic here...
      console.log("Processing transaction...");

      if (!response.ok) {
        console.error("Server response:", result);
        throw new Error(result.message || "Fee delegation failed");
      }

      console.log("Transaction sent:", result.transactionHash);
      setTxHash(result.transactionHash);
    } catch (err) {
      console.error("Error minting NFT:", err);
      //@ts-ignore
      setError(err.message);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Kaia Gas Abstraction</title>
        <meta name="description" content="kaia gas abstraction example" />
        <link rel="icon" href="/kaia.svg" />
      </Head>

      <main className={styles.main}>
        {!wallet?.accounts ? (
          <button
            style={buttonStyles}
            disabled={connecting}
            onClick={() => (wallet ? disconnect(wallet) : connect())}
          >
            {connecting ? "Connecting" : wallet ? "Disconnect" : "Connect Wallet"}
          </button>
        ) : (
          <div className={styles.title}>
            <h1 className={styles.title}>
              Demo of Kaia{" "}
              <a
                className={styles.kaialink}
                href="https://docs.kaia.io/learn/transactions/fee-delegation/"
              >
                {" "}
                Gas Abstraction
              </a>
            </h1>
            <p className={styles.nftDesc}>Waveforms are a Dynamic Fully Onchain NFT created by using your kaia addresses 40 characters and converting them into a visual representation. </p>
            <p className={styles.nftDesc}>Based on <a className={styles.nftDescLink} href="https://waveforms.apexdeployer.xyz/">Apex777.eth Waveforms</a> </p>

            <button onClick={mintNFT} className={styles.mintBtn}>
              Mint WaveForm NFT
            </button>

            {txHash && (
              <a
                className={styles.viewExplorer}
                href={`https://kairos.kaiascan.io/tx/${txHash}`}
                target="blank"
              >
                View on Explorer
              </a>
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://docs.kaia.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/kaia.svg" alt="Vercel Logo" width={52} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
