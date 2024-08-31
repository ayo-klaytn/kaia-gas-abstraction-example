var express = require("express");
var router = express.Router();
const { Web3 } = require("@kaiachain/web3js-ext");
require('dotenv').config();

const RPC_URL = process.env.RPC_URL || "https://public-en-kairos.node.kaia.io";
console.log("Using RPC URL:", RPC_URL);

router.post("/", async (req, res) => {
  try {
    const { rawTransaction } = req.body;
    console.log("Received rawTransaction:", rawTransaction);

    if (!rawTransaction) {
      throw new Error("No rawTransaction provided in request body");
    }

    const provider = new Web3.providers.HttpProvider(RPC_URL);
    const web3 = new Web3(provider);

    const feePayerPrivateKey = process.env.FEE_PAYER_PRIVATE_KEY;
    if (!feePayerPrivateKey) {
      throw new Error("FEE_PAYER_PRIVATE_KEY is not set in environment variables");
    }
    console.log("Fee payer private key configured:", feePayerPrivateKey.slice(0, 6) + "..." + feePayerPrivateKey.slice(-4));

    const feePayerAccount = web3.eth.accounts.privateKeyToAccount(feePayerPrivateKey);
    console.log("Fee payer account:", feePayerAccount.address);

    const signResult = await feePayerAccount.signTransactionAsFeePayer(rawTransaction);
    console.log("Transaction signed by fee payer:", signResult.transactionHash);

    const receipt = await web3.eth.sendSignedTransaction(signResult.rawTransaction);
    console.log("Transaction receipt:", receipt);

    return res.status(200).json({ 
      success: true, 
      transactionHash: receipt.transactionHash,
      contractAddress: receipt.contractAddress 
    });
  } catch (err) {
    console.error('Fee delegation error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message,
      stack: err.stack,
      rawTransaction: req.body.rawTransaction ? 'Provided' : 'Not provided'
    });
  }
});

module.exports = router;