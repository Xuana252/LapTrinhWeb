"use server";

import { generateDummyCustomerData, generateMockUserData } from "@util/generator/customer";

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

export const getCustomerData = async () => {
  return generateMockUserData()
  // if (process.env.DEV_ENV !== "production") return generateMockUserData();
  // try {
  //   const response = await fetch(`${process.env.APP_URL}/customers`);
  //   if (response.ok) {
  //     const data = await response.json();
  //     return data;
  //   } else {
  //     return [];
  //   }
  // } catch (error) {
  //   console.log(error);
  //   return [];
  // }
}



