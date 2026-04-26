import React, { createContext, useEffect, useState } from "react";
import fallbackProducts from "../Components/Assets/all_product";
import { requestJson } from "../utils/api";
import {
  STORAGE_KEYS,
  createCartState,
  normalizeCartState,
  readJSON,
  removeStoredValue,
  writeJSON,
} from "../utils/storage";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [allProducts, setAllProducts] = useState(fallbackProducts);
  const [cartItems, setCartItems] = useState(() =>
    normalizeCartState(readJSON(STORAGE_KEYS.cart, null), fallbackProducts)
  );
  const [currentUser, setCurrentUser] = useState(() =>
    readJSON(STORAGE_KEYS.currentUser, null)
  );
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem(STORAGE_KEYS.authToken) || ""
  );
  const [backendStatus, setBackendStatus] = useState(
    authToken ? "checking" : "idle"
  );

  useEffect(() => {
    let ignore = false;

    const loadProducts = async () => {
      try {
        const remoteProducts = await requestJson("/allproducts", {
          method: "GET",
        });

        if (!ignore && Array.isArray(remoteProducts) && remoteProducts.length > 0) {
          const normalizedProducts = remoteProducts.map((product) => ({
            ...product,
            id: Number(product.id),
            old_price: Number(product.old_price),
            new_price: Number(product.new_price),
          }));
          setAllProducts(normalizedProducts);
        }
      } catch (error) {
        if (!ignore) {
          setAllProducts(fallbackProducts);
        }
      }
    };

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    setCartItems((previousCart) => normalizeCartState(previousCart, allProducts));
  }, [allProducts]);

  useEffect(() => {
    writeJSON(STORAGE_KEYS.cart, cartItems);
  }, [cartItems]);

  useEffect(() => {
    if (currentUser) {
      writeJSON(STORAGE_KEYS.currentUser, currentUser);
      return;
    }

    removeStoredValue(STORAGE_KEYS.currentUser);
  }, [currentUser]);

  useEffect(() => {
    if (!authToken) {
      setBackendStatus("idle");
      return;
    }

    let ignore = false;

    const hydrateRemoteCart = async () => {
      try {
        const remoteCart = await requestJson("/getcart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
          body: JSON.stringify({}),
        });

        if (!ignore) {
          setCartItems(normalizeCartState(remoteCart, allProducts));
          setBackendStatus("connected");
        }
      } catch (error) {
        if (!ignore) {
          setBackendStatus("offline");
        }
      }
    };

    hydrateRemoteCart();

    return () => {
      ignore = true;
    };
  }, [authToken, allProducts]);

  const syncCart = async (path, itemId) => {
    if (!authToken) {
      return;
    }

    try {
      await requestJson(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ itemId }),
      });
      setBackendStatus("connected");
    } catch (error) {
      setBackendStatus("offline");
    }
  };

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    syncCart("/addtocart", itemId);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));
    syncCart("/removefromcart", itemId);
  };

  const clearCart = () => {
    setCartItems(createCartState(allProducts));
  };

  const loginUser = ({ token, user }) => {
    localStorage.setItem(STORAGE_KEYS.authToken, token);
    setAuthToken(token);
    setCurrentUser(user);
  };

  const logoutUser = () => {
    removeStoredValue(STORAGE_KEYS.authToken);
    setAuthToken("");
    setCurrentUser(null);
    setBackendStatus("offline");
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = allProducts.find(
          (product) => product.id === Number(itemId)
        );

        if (itemInfo) {
          totalAmount += (Number(itemInfo.new_price) || 0) * cartItems[itemId];
        }
      }
    }

    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItems = 0;

    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        totalItems += cartItems[itemId];
      }
    }

    return totalItems;
  };

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    allProducts,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    currentUser,
    isAuthenticated: Boolean(authToken),
    backendStatus,
    loginUser,
    logoutUser,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
