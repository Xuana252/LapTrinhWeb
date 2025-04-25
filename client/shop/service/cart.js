"use server";

import { generateDummyCart } from "@util/generator/cart";

export const getCart = async (id) => {
  if (process.env.DEV_ENV !== "production")
    return generateDummyCart(Math.round(Math.random() * 10) + 1);
  try {
    const response = await fetch(`${process.env.APP_URL}/carts/${id}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const addCartItem = async (id,product_id,quantity) => {
   if (process.env.DEV_ENV !== "production") return true;
   try {
    const response = await fetch(
      `${process.env.APP_URL}/carts/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({product_id:product_id,quantity:quantity})
      }
    );
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const updateCartItem = async (id, product_id,quantity) => {
  // if (process.env.DEV_ENV !== "production") return true;
  try {
    const response = await fetch(
      `${process.env.APP_URL}/${id}/${product_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({quantity:quantity})
      }
    );
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const deleteAllCartItem = async (id) => {
  // if (process.env.DEV_ENV !== "production") return true;
  try {
    const response = await fetch(
      `${process.env.APP_URL}/carts/${id}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const deleteCartItem = async (id, product_id) => {
  // if (process.env.DEV_ENV !== "production") return true;
  try {
    const response = await fetch(
      `${process.env.APP_URL}/carts/${id}/${product_id}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
