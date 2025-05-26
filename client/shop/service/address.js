"use server";

import { generateDummyCustomerAddresses } from "@util/generator/address";

export const fetchProvinces = async () => {
  const response = await fetch("https://api.vnappmob.com/api/v2/province/");
  if (response.ok) {
    const data = await response.json();
    return data.results;
  }
  return [];
};

export const fetchDistricts = async (id) => {
  const response = await fetch(
    `https://api.vnappmob.com/api/v2/province/district/${id}`
  );
  if (response.ok) {
    const data = await response.json();
    return data.results;
  }
  return [];
};

export const fetchWards = async (id) => {
  const response = await fetch(
    `https://api.vnappmob.com/api/v2/province/ward/${id}`
  );
  if (response.ok) {
    const data = await response.json();
    return data.results;
  }
  return [];
};

export const getCustomerAddresses = async (id) => {
  // return generateDummyCustomerAddresses(Math.floor(Math.random() * 4) + 1);
  if (process.env.DEV_ENV !== "production")
    return generateDummyCustomerAddresses(Math.floor(Math.random() * 4) + 1);
  try {
    const response = await fetch(`${process.env.APP_URL}/users/${id}/address`, {
      headers: {
        access_token: "",
      },
    });
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

export const postCustomerAddress = async (id, payload) => {
  if (process.env.DEV_ENV !== "production") return payload;
  try {
    const response = await fetch(
      `${process.env.APP_URL}/users/${id}/address`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

export const patchCustomerAddress = async (id, payload) => {
  if (process.env.DEV_ENV !== "production") return payload;
  try {
    const response = await fetch(`${process.env.APP_URL}/users/${id}/address`, {
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

export const deleteCustomerAddress = async (id, address_id) => {
  if (process.env.DEV_ENV !== "production") return true;
  try {
    const response = await fetch(
      `${process.env.APP_URL}/users/${id}/address/${address_id}`,
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
