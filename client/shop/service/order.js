"use server";

import {
  generateDummyOrderData,
  generateDummyOrdersData,
} from "@util/generator/order";

export const getOrder = async (id) => {
  if (process.env.DEV_ENV !== "production") return generateDummyOrderData();
  try {
    const response = await fetch(
      `${process.env.APP_URL}/orders/${id}`
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getOrders = async (id) => {
  if (process.env.DEV_ENV !== "production")
    return generateDummyOrdersData(Math.round(Math.random() * 4) + 1);
  try {
    const response = await fetch(
      `${process.env.APP_URL}/orders/customer/${id}`
    );
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

export const cancelOrder = async (id) => {
  try {
    const response = await fetch(`${process.env.APP_URL}/orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "cancelled",
      }),
    });
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

export const postOrder = async (payload) => {
  if (process.env.DEV_ENV !== "production") return { order_id: "123" };

  try {
    const response = await fetch(`${process.env.APP_URL}/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      
      const data = await response.json();
      return { order: data, success: true, message: "" };
    } else {
      const data = await response.json();
      return {
        order: null,
        success: false,
        message: data.message || "Failed to create order",
      };
    }
  } catch (error) {
    console.log(error);
    return { order: null, success: false, message: "Failed to create order" };
  }
};
