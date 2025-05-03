"use server";

import {
  categoriesPreset,
  generateMockCategoryData,
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

export const getCategoryData = async () => {
  return generateMockCategoryData();
  // if (process.env.DEV_ENV !== "production") return categoriesPreset
  // try {
  //     const response = await fetch(`${process.env.APP_URL}/products/category`)
  //     if(response.ok) {
  //         const data =  await response.json()
  //         return data
  //     } else {
  //         return []
  //     }
  // } catch (error) {
  //     console.log(error)
  //     return []
  // }
};
