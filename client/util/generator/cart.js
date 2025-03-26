import { generateDummyProductData } from "./product";

export const generateDummyCart = (num=1) => {
    const cartItems = [];
  
    // Helper functions to generate random IDs and quantities
    const getRandomId = (prefix) => `${prefix}_${Math.floor(Math.random() * 1000)}`;
    const getRandomQuantity = () => Math.floor(Math.random() * 5) + 1; // between 1 and 5
  
    for (let i = 0; i < num; i++) {
      const cartItem = {
        customer_id: getRandomId("customer"),      // e.g., "cust_123"
        product_id: getRandomId("prod"),       // e.g., "prod_456"
        quantity: getRandomQuantity(), 
        product: generateDummyProductData()[0]     // e.g., random number between 1 and 5
      };
      cartItems.push(cartItem);
    }
  
    return cartItems;
}

