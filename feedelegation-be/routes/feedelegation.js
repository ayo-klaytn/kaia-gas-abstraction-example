var express = require('express');
var router = express.Router();
const ethers = require("ethers");
const { Wallet } = require("@kaiachain/ethers-ext");

const RPC_URL = process.env.RPC_URL || "https://public-en-kairos.node.kaia.io";

router.post('/', async (req, res) => {
  try {
    const { deployTx } = req.body;

    const provider = new JsonRpcProvider("https://public-en-kairos.node.kaia.io");

    if(!process.env.FEE_PAYER_PRIVATE_KEY) {
      throw new Error("Please configure fee payer private key");
    }
    // Feepayer keyring generation
    let feePayerPrivateKey = process.env.FEE_PAYER_PRIVATE_KEY;

    const wallet = new Wallet(feePayerPrivateKey, provider);

    const parsedTx = ethers.utils.parseTransaction(deployTx);

    // Signs the transaction as a fee payer
    await wallet.signTransactionAsFeePayer(feePayerKeyring.address, parsedTx);

    // Transaction execution
    const receipt = await wallet.sendTransactionAsFeePayer(deployTxDecoded);

    return res.status(200).json({success: true, contractAddress: receipt.contractAddress });

  } catch(err) {
    res.status(500).json({success: false, message: err.message});
  }
});

module.exports = router;
