import React, { useContext, useMemo } from "react";
import "./RelatedProduct.css";
import Item from "../Items/Items";
import { ShopContext } from "../../Context/ShopContext";

const RelatedProduct = ({ category, currentProductId }) => {
  const { allProducts } = useContext(ShopContext);
  const relatedProducts = useMemo(
    () =>
      allProducts
        .filter(
          (item) => item.category === category && item.id !== currentProductId
        )
        .slice(0, 4),
    [allProducts, category, currentProductId]
  );

  if (!relatedProducts.length) {
    return null;
  }

  return (
    <div className="relatedproducts">
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {relatedProducts.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProduct;
