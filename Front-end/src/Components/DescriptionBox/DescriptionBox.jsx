import React from "react";
import "./DescriptionBox.css";

const DescriptionBox = ({ product }) => {
  const categoryLabel =
    product.category.charAt(0).toUpperCase() + product.category.slice(1);

  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
          {product.name} is part of our {categoryLabel.toLowerCase()} collection and is designed
          for shoppers who want everyday comfort without giving up a polished look. The fabric
          feel is soft, lightweight, and easy to style across seasons.
        </p>
        <p>
          This product page is now fully connected to the storefront flow, so you can choose a
          size, add the item to cart, and continue shopping with your selections saved locally
          even when the backend is unavailable.
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
