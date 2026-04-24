export const STORAGE_KEYS = {
  authToken: "auth-token",
  cart: "shopper-cart",
  currentUser: "shopper-user",
  users: "shopper-users",
  newsletter: "shopper-newsletter-email",
};

export const readJSON = (key, fallbackValue) => {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch (error) {
    return fallbackValue;
  }
};

export const writeJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeStoredValue = (key) => {
  localStorage.removeItem(key);
};

export const createCartState = (products) =>
  products.reduce((cart, product) => {
    cart[product.id] = 0;
    return cart;
  }, {});

export const normalizeCartState = (rawCart, products) => {
  const baseCart = createCartState(products);

  if (!rawCart || typeof rawCart !== "object") {
    return baseCart;
  }

  products.forEach((product) => {
    const quantity = Number(rawCart[product.id]);
    baseCart[product.id] = Number.isFinite(quantity) && quantity > 0 ? quantity : 0;
  });

  return baseCart;
};
