"use server";

import { generateDummyProductData, generateDummyProductDetailData, generateMockProductRevenueData, generateMockProductsRevenueData, } from "@util/generator/product";


export const getAllProduct = async () => {
  if(process.env.DEV_ENV!=="production") return generateDummyProductData(36)
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products`
    );

    if (response.ok) {
      const data = await response.json();
      return data
    } else {
      return []
    }
  } catch (e) {
    console.log(e);
    return []
  }
};


export const getProducts = async (size) => {
  
  if(process.env.DEV_ENV!=="production") return generateDummyProductData(size)
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products?pageSize=${size}`
    );

    if (response.ok) {
      const data = await response.json();
      return  data
    } else {
      return []
    }
  } catch (e) {
    console.log(e);
    return []
  }
};

export const getProductsRevenue = async () => {
  if(process.env.DEV_ENV!=="production") return generateMockProductsRevenueData(6)
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products/revenue`
    );

    if (response.ok) {
      const data = await response.json();
      return data
    } else {
      return []
    }
  } catch (e) {
    console.log(e);
    return []
  }
}

export const getProductRevenue = async (id) => {
  
  if(process.env.DEV_ENV!=="production") return generateMockProductRevenueData()
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products/${id}/revenue`
    );

    if (response.ok) {
      const data = await response.json();
      return  data
    } else {
      return []
    }
  } catch (e) {
    console.log(e);
    return []
  }
};

export const getProductDetail = async (id) => {
  if(process.env.DEV_ENV!=="production") return generateDummyProductDetailData();

  try {
    const response = await fetch(
      `${process.env.APP_URL}/products/${id}`
    );

    if (response.ok) {
      const data = await response.json();
      return data
    } else {
      return {}
    }
  } catch (e) {
    console.log(e);
    return {}
  }
};

export const updateProduct = async (id, payload) => {
  if (process.env.DEV_ENV !== "production") return true;
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products/${id}`,
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

export const createProduct = async (payload) => {
  if (process.env.DEV_ENV !== "production") return true;
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products`,
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


export const deleteProduct = async (id) => {
  if (process.env.DEV_ENV !== "production") return true;
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products/${id}`,
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