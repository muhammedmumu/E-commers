import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import Breadcrums from "../Components/Breadcrums/Breadcrums";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProduct from "../Components/RlaatedProduct/RelatedProduct";

const Product = () => {
  const { allProducts } = useContext(ShopContext);
  const { productId } = useParams();
  const product = allProducts.find((item) => item.id === Number(productId));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) {
    return (
      <div className="page-message">
        <h2>Product not found</h2>
        <p>The product you are looking for does not exist or has been moved.</p>
        <Link to="/">Back to the storefront</Link>
      </div>
    );
  }

  return (
    <div>
      <Breadcrums product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox product={product} />
      <RelatedProduct
        category={product.category}
        currentProductId={product.id}
      />
    </div>
  );
};

export default Product;
