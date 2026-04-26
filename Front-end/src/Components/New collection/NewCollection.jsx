import React, { useContext, useMemo } from "react";
import './NewCollection.css';
import Item from "../Items/Items";
import { ShopContext } from "../../Context/ShopContext";

const NewCollection = () => {
    const { allProducts } = useContext(ShopContext);
    const newCollection = useMemo(
        () => allProducts.slice(1).slice(-8),
        [allProducts]
    );


    return (
        <div className="newCollection">
            <h1>NEW COLLECTION</h1>
            <hr />
            <div className="collection">
                {newCollection.map((item) => {
                    return <Item key={item.id} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
                })}
            </div>
        </div>
    )
}

export default NewCollection;
