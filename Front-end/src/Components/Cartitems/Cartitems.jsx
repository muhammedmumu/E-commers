import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Cartitems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const Cartitems = () => {
  const [promoCode, setPromoCode] = useState("");
  const [message, setMessage] = useState("");
  const { getTotalCartAmount, allProducts, cartItems, removeFromCart, clearCart } =
    useContext(ShopContext);

  const cartProducts = useMemo(
    () => allProducts.filter((product) => cartItems[product.id] > 0),
    [allProducts, cartItems]
  );

  const totalAmount = getTotalCartAmount();

  const handleCheckout = () => {
    clearCart();
    setPromoCode("");
    setMessage("Checkout complete. Thanks for shopping with us.");
  };

  const handlePromoSubmit = () => {
    if (!promoCode.trim()) {
      setMessage("Enter a promo code before submitting.");
      return;
    }

    if (promoCode.trim().toUpperCase() === "SHOP10") {
      setMessage("Promo code applied. The demo store does not change totals, but the code is accepted.");
      return;
    }

    setMessage("That promo code is not valid.");
  };

  if (!cartProducts.length) {
    return (
      <div className="cartitems cartitems-empty">
        <h1>Your cart is empty</h1>
        <p>Add a few products to see totals, checkout, and promo code support.</p>
        <Link to="/">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {cartProducts.map((product) => (
        <div key={product.id}>
          <div className="cartitems-format cartitems-format-main">
            <img src={product.image} alt={product.name} className="carticon-product-icon" />
            <p>{product.name}</p>
            <p>${product.new_price}</p>
            <button type="button" className="cartitems-quantity">
              {cartItems[product.id]}
            </button>
            <p>${product.new_price * cartItems[product.id]}</p>
            <img
              className="cartitems-remove-icon"
              src={remove_icon}
              onClick={() => removeFromCart(product.id)}
              alt="Remove item"
            />
          </div>
          <hr />
        </div>
      ))}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${totalAmount}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Total</p>
              <h3>${totalAmount}</h3>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, enter it here.</p>
          <div className="cartitems-promobox">
            <input
              type="text"
              value={promoCode}
              onChange={(event) => setPromoCode(event.target.value)}
              placeholder="Promo code"
            />
            <button onClick={handlePromoSubmit}>Submit</button>
          </div>
          {message ? <p className="cartitems-message">{message}</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Cartitems;
