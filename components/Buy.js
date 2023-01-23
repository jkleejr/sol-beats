import React, {useState, useMemo} from "react";
import {Keypair, Transaction} from "@solana/web3.js";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {InfinitySpin} from "react-loader-spinner";
import IPFSDownload from "./IpfsDownload";

export default function Buy({itemID}){
    const{connection} = useConnection();
    const{publicKey, sendTransaction} = useWallet();
    // pubkey used to identify order
    const orderID = useMemo(() => Keypair.generate().publicKey, []);

    const [paid, setPaid] = useState(null);
    const[loading, setLoading] = useState(false);

    const order = useMemo(
        () => ({
            buyer: publicKey.toString(),
            orderID: orderID.toString(),
            itemID: itemID,
        }),
        [publicKey, orderID, itemID]
    );

    // fetch transaction object from server
    const processTransaction = async () => {
        setLoading(true);
        const txResponse = await fetch("../api/createTransaction", {
            method: "POST",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
        });
        const txData = await txResponse.json();

        // create transaction object
        const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
        console.log("tx data is", tx);

        // attempt to send transaction to network
        try{
            const txHash = await sendTransaction(tx, connection);
            console.log(`transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`)
            setPaid(true);
        }  
            catch(error){
            console.error(error);
        }   finally{
            setLoading(false);
        }
    };
        
    if(!publicKey){
        return(
            <div>
                <p> you must connect your wallet to make transactions </p>
            </div>
        );
    }

    if(loading){
        return <InfinitySpin color="blue" />;
    }   
    
    return (
        <div>
            {paid ? (
                <IPFSDownload filename = "4am.zip" hash = "QmPBXFGGYoikAmawvw4MSEnm84meRdbjwUkMcBkQdVYVV1" cta="music"/>
            ) : (
                <button disabled = {loading} className = "buy-button" onClick = {processTransaction}>
                    Buy now
                </button>
            )}
            </div>
    );
}

