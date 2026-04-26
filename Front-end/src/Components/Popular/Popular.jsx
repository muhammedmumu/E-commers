import React, { useContext, useMemo } from "react";
import './Popular.css'
import Item from "../Items/Items";
import { ShopContext } from "../../Context/ShopContext";

const Popular = () => {
    const { allProducts } = useContext(ShopContext);
    const popularProducts = useMemo(
        () => allProducts.filter((item) => item.category === "women").slice(0, 4),
        [allProducts]
    );

    return (
        <div className="popular">
            <h1>POPULAR IN WOMEN</h1>

            <hr />
            <div className="popular-item">
                {popularProducts.map((item) => {
                    return <Item key={item.id} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
                })}


            </div>
        </div>
    )
}

export default Popular;
