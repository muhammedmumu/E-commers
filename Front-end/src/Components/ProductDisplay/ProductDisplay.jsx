import React, { useContext, useMemo, useState } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";

const ProductDisplay = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState("M");
  const { addToCart } = useContext(ShopContext);
  const categoryLabel =
    product.category.charAt(0).toUpperCase() + product.category.slice(1);

  const productTags = useMemo(
    () => [categoryLabel, "Trending", "Best Seller"],
    [categoryLabel]
  );

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {sizeOptions.slice(0, 4).map((size) => (
            <img key={size} src={product.image} alt={`${product.name} view ${size}`} />
          ))}
        </div>
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={product.image}
            alt={product.name}
          />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>

        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_dull_icon} alt="half rating" />
          <p>(122 reviews)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">${product.old_price}</div>
          <div className="productdisplay-right-price-new">${product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">
          Built for everyday wear with a comfortable fit, premium finish, and a clean
          silhouette that works across casual and occasion styling.
        </div>
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            {sizeOptions.map((size) => (
              <button
                key={size}
                type="button"
                className={size === selectedSize ? "selected" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => addToCart(product.id)}>ADD TO CART</button>

        <p className="productdisplay-right-category">
          <span>Category:</span> {categoryLabel}
        </p>
        <p className="productdisplay-right-category">
          <span>Selected Size:</span> {selectedSize}
        </p>
        <p className="productdisplay-right-category">
          <span>Tags:</span> {productTags.join(", ")}
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
