"use server";

import {
  generateDummyOrdersData,
  generateDummyOrderData,
  generateMockOrderData,
  generateMockRevenueData,
} from "@util/generator/order";
import { count } from "console";

export const getOrder = async (id) => {
  if (process.env.DEV_ENV !== "production") return generateDummyOrderData();
  try {
    const response = await fetch(`${process.env.APP_URL}/orders/${id}`);
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

export const getCustomerOrders = async (id) => {
  if (process.env.DEV_ENV !== "production")
    return generateDummyOrdersData(Math.round(Math.random() * 4) + 1);
  try {
    const response = await fetch(`${process.env.APP_URL}/orders/customer/${id}`);
    if (response.ok) {
      const data = await response.json();
      return {data:data,count: data.length};
    } else {
      return {data:[], count: 0};
    }
  } catch (error) {
    console.log(error);
    return {data:[], count: 0};
  }
};

export const getAllOrder = async (
  page,
  limit,
  searchText,
  dateSort,
  revenueSort,
  orderStatus
) => {
  if (process.env.DEV_ENV !== "production") return generateDummyOrdersData(20);
  try {
    const response = await fetch(
      `${process.env.APP_URL}/orders?page=${page}&limit=${limit}&searchText=${searchText}&dateSort=${dateSort}&revenueSort=${revenueSort}&orderStatus=${orderStatus}`
    );
    if (response.ok) {
      const data = await response.json();
      return { orders: data.orders, count: data.count };
    } else {
      return { orders: [], count: 0 };
    }
  } catch (error) {
    console.log(error);
    return { orders: [], count: 0 };
  }
};

export const changeOrderState = async (id, status) => {
  try {
    const response = await fetch(`${process.env.APP_URL}/orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
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

export const getOrderData = async () => {
  if (process.env.DEV_ENV !== "production") return generateMockOrderData();
  try {
    const response = await fetch(`${process.env.APP_URL}/orders/monthlyOrder`);
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

export const getRevenueData = async () => {
  if (process.env.DEV_ENV !== "production") return generateMockRevenueData(6);
  try {
    const response = await fetch(`${process.env.APP_URL}/orders/revenue`);
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
