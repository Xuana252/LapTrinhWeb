"use server";

import {
  generateDummyCustomerData,
  generateDummyCustomerRevenueData,
  generateDummyCustomersData,
  generateMockUserData,
} from "@util/generator/customer";

export const getCustomer = async (id) => {
  if (process.env.DEV_ENV !== "production") return generateDummyCustomerData();
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

export const banCustomer = async (id) => {
  if (process.env.DEV_ENV !== "production") return true;
  try {
    const response = await fetch(`${process.env.APP_URL}/users/${id}/ban`,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },

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

export const getAllCustomers = async (
  limit,
  page,
  searchText,
  dateSort,
  banFilter
) => {
  if (process.env.DEV_ENV !== "production")
    return generateDummyCustomersData(20);
  try {
    const response = await fetch(
      `${process.env.APP_URL}/users?page=${page}&limit=${limit}&searchText=${searchText}&dateSort=${dateSort}&banFilter=${banFilter}`
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return {users: [], count: 0};
    }
  } catch (error) {
    console.log(error);
    return {users: [], count: 0};
  }
};

export const getCustomerRevenue = async (id) => {
  if (process.env.DEV_ENV !== "production")
    return generateDummyCustomerRevenueData();
  try {
    const response = await fetch(`${process.env.APP_URL}/orders/${id}/revenue`);
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

export const getCustomerData = async () => {
  if (process.env.DEV_ENV !== "production") return generateMockUserData();
  try {
    const response = await fetch(`${process.env.APP_URL}/users/monthlyUser`);
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
