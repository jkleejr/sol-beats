import React from "react";
import IPFSDownload from "./IpfsDownload";
import styles from "../styles/Item.module.css";
import Buy from "./Buy";


// display items
export default function Item ({ item }) {
    const { id, name, price, description, image_url } = item;

    return(
        <div className= {styles.item_container}>
            <div >
                <img className= {styles.item_image}src={image_url} alt={name} />
            </div>

            <div className= {styles.item_details}>
                <div className={styles.item_text}>
                    <div className={styles.item_title}>{name}</div>
                    <div className={styles.item_description}>{description}</div>
                </div>

                <div className={styles.item_action}>
                    <div classname={styles.item_price}>{price} SOL </div>
                        <Buy itemID={id} />
                </div>
            </div>
        </div>
    );
}
