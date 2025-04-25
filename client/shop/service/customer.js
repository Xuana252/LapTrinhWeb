"use server";

import { generateDummyCustomerData } from "@util/generator/customer";

export const getCustomer = async (id) => {
  if (process.env.DEV_ENV !== "production") return generateDummyCustomerData();
  try {
    const response = await fetch(`${process.env.APP_URL}/customers/${id}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return {};
    }
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const patchCustomer = async (payload) => {
  try {
    const response = await fetch(
      `${process.env.APP_URL}/customers/${payload.user_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload.new_customer),
      }
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

export const singUp = async (payload) => {
  try {
    const response = await fetch(`${process.env.APP_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return true;
    } else {
      const data = await response.json();
      console.log(data);
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
