import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    clusterApiUrl,
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import BigNumber from "bignumber.js";
import products from "./products.json";

const sellerAddress = ""
const sellerPublicKey = new PublicKey(sellerAddress);

const createTransaction = async(req, res) => {
    try{
        // transaction data from request body
        const {buyer, orderID, itemID} = req.body;

        if(!buyer){
            return res.status(400).json({
                message: "missing buyer address",
            });
        }

        if(!orderID){
            return res.status(400).json({
                message: "missing order id",
            });
        }

        // price from items.json using itemID
        const itemPrice = items.find((item) => item.id === itemID).price;

        if(!itemPrice){
            return res.status(404).json({
                message: "item not found...check item id",
            });
        }

        // convert price to correct format
        const bigAmount = BigNumber(itemPrice);
        const buyerPublicKey = new PublicKey(buyer);
        const network = WalletAdapterNetwork.Devnet;
        const endpoint = clusterApiUrl(network);
        const connection = new Connection(endpoint);

        const {blockhash} = await connection.getLatestBlockhash("finalized");

        // recent block ID and pubkey of acc paying fee
        const tx = new Transaction({
            recentBlockhash: blockhash,
            feePayer: buyerPublicKey,
        });

        // transfer sol
        const transferInstruction = SystemProgram.transfer({
            fromPubKey: buyerPublicKey,
            lamports: bigAmount.multipliedBy(LAMPORTS_PER_SOL).toNumber(),
            toPubkey: sellerPublicKey,
        });
        // adding instructions to transaction
        transferInstruction.keys.push({
            pubkey: new PublicKey(orderID),
            isSigner: false,
            isWritable: false,
        });

        tx.add(transferInstruction);

        // transaction formatting
        const serializedTransaction = tx.serialize({
            requireAllSignatures: false,
        });
        const base64 = serializedTransaction.toString("base64");


        res.status(200).json({
            transaction: base64,
        });
    } catch(error){
        console.error(error);
        res.status(500).json({error: "error creating tx"});
        return;
    }
}

export default function handler(req, res){
    if(req.method === "POST"){
        createTransaction(req, res);
    }else{
        res.status(405).end();
    }
}

