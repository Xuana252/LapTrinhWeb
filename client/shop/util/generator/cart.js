import { generateDummyProductData } from "./product";

export const generateDummyCart = (num = 1) => {
  const cartItems = [];

  const getRandomQuantity = () => Math.floor(Math.random() * 5) + 1; // between 1 and 5

  for (let i = 0; i < num; i++) {
    const cartItem = {
      quantity: getRandomQuantity(),
      product_id: generateDummyProductData()[0], // e.g., random number between 1 and 5
    };
    cartItems.push(cartItem);
  }

  return cartItems;
};
