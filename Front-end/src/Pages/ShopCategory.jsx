import React, { useContext, useEffect, useMemo, useState } from "react";
import "./CSS/ShopCategory.css";
import Item from "../Components/Items/Items";
import { ShopContext } from "../Context/ShopContext";

const ShopCategory = (props) => {
  const { allProducts } = useContext(ShopContext);
  const [visibleCount, setVisibleCount] = useState(8);
  const [sortOrder, setSortOrder] = useState("featured");

  useEffect(() => {
    setVisibleCount(8);
    setSortOrder("featured");
  }, [props.category]);

  const filteredProducts = useMemo(
    () => allProducts.filter((item) => item.category === props.category),
    [allProducts, props.category]
  );

  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];

    switch (sortOrder) {
      case "price-low":
        return products.sort((a, b) => a.new_price - b.new_price);
      case "price-high":
        return products.sort((a, b) => b.new_price - a.new_price);
      case "name":
        return products.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return products;
    }
  }, [filteredProducts, sortOrder]);

  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleCount < sortedProducts.length;

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="" />

      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-{visibleProducts.length} </span>out of {sortedProducts.length} products
        </p>

        <label className="shopcategory-sort">
          <span>Sort by</span>
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <div className="shopcategory-products">
        {visibleProducts.map((item) => (
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

      {hasMoreProducts ? (
        <button
          type="button"
          className="shopcategory-loadmore"
          onClick={() => setVisibleCount((prev) => prev + 4)}
        >
          Explore More
        </button>
      ) : (
        <div className="shopcategory-loadmore is-disabled">
          You have seen everything in this collection.
        </div>
      )}
    </div>
  );
};

export default ShopCategory;
