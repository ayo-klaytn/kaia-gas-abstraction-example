var express = require("express");
var router = express.Router();
const ethers = require("ethers");
const { Web3 } = require("@kaiachain/web3js-ext");

const RPC_URL = process.env.RPC_URL || "https://public-en-kairos.node.kaia.io";
console.log(RPC_URL);


router.post("/", async (req, res) => {
  try {
    const { rawTransaction } = req.body;

    const provider = new Web3.providers.HttpProvider(RPC_URL);
    const web3 = new Web3(provider);

    if (!process.env.FEE_PAYER_PRIVATE_KEY) {
      throw new Error("Please configure fee payer private key");
    }
    // Feepayer keyring generation
    let feePayerPrivateKey = process.env.FEE_PAYER_PRIVATE_KEY;

    const feePayerAccount =
      web3.eth.accounts.privateKeyToAccount(feePayerPrivateKey);

    // Sign and send transaction by fee payer
    const signResult = await feePayerAccount.signTransactionAsFeePayer(
      rawTransaction
    );
    console.log("signedTx", signResult.transactionHash);

    const receipt = await web3.eth.sendSignedTransaction(
      signResult
    );
    console.log("receipt", receipt);

    return res
      .status(200)
      .json({ success: true, contractAddress: receipt.contractAddress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
