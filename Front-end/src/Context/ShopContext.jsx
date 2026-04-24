import React, { createContext, useEffect, useState } from 'react';
import allProducts from '../Components/Assets/all_product'; // Assuming this is a local JSON file with product data
import { API_BASE_URL } from '../config';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index <= 300; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {

        if (localStorage.getItem('auth-token')) {
            fetch(`${API_BASE_URL}/getcart`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: "",
            })
                .then((response) => response.json())
                .then((data) => setCartItems(data))
                .catch((error) => console.error('Error fetching cart data:', error));
        }
    }, []);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        if (localStorage.getItem('auth-token')) {
            fetch(`${API_BASE_URL}/addtocart`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.error('Error adding to cart:', error));
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (localStorage.getItem('auth-token')) {
            fetch(`${API_BASE_URL}/removefromcart`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.error('Error removing from cart:', error));
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = allProducts.find((product) => product.id === Number(item));
                totalAmount += itemInfo.new_price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
        let totalItems = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItems += cartItems[item];
            }
        }
        return totalItems;
    }

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        allProducts,
        cartItems,
        addToCart,
        removeFromCart,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;
