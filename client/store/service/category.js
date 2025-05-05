"use server";

import {
  categoriesPreset,
  generateMockCategoryData,
  generateMockCategoryRevenueData,
} from "@util/generator/category";

export const getAllCategory = async () => {
  if (process.env.DEV_ENV !== "production") return categoriesPreset;
  try {
    const response = await fetch(`${process.env.APP_URL}/products/category`);
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

export const getCategory = async (id) => {
  if (process.env.DEV_ENV !== "production") return categoriesPreset[0];
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products/category/${id}`
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

export const getCategoryData = async () => {
  if (process.env.DEV_ENV !== "production") return generateMockCategoryData();
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products/category/revenue`
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

export const getCategoryRevenue = async (id) => {
  if (process.env.DEV_ENV !== "production")
    return generateMockCategoryRevenueData();
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products/category/${id}/revenue`
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return [];
    }
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const createCategory = async (payload) => {
  if (process.env.DEV_ENV !== "production") return true;
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products/category`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const updateCategory = async (id, payload) => {
  if (process.env.DEV_ENV !== "production") return true;
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products/category/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const deleteCategory = async (id) => {
  if (process.env.DEV_ENV !== "production") return true;
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products/category/${id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};


