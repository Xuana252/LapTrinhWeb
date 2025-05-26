"use server";

import { generateDummyCustomerData } from "@util/generator/customer";

export const getCustomer = async (id) => {
  if (process.env.DEV_ENV !== "production")
    return generateDummyCustomerData(id);
  try {
    const response = await fetch(`${process.env.APP_URL}/users/${id}`);
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

export const patchCustomer = async (id, payload) => {
  try {
    const response = await fetch(`${process.env.APP_URL}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
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
    const response = await fetch(`${process.env.APP_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      // const data = await response.json();
      return { success: true, message: "You're all signed up! Welcome" };
    } else if (response.status === 400) {
        return { success: false, message: "Email already existed" };
    }
    return false;
  } catch (error) {
    console.log(error);
     return { success: false, message: "Failed to sign up, please try again later" };
  }
};
