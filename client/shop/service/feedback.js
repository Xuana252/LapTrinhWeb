"use server";

import { generateDummyFeedback } from "@util/generator/feedback";

export const getFeedbacks = async (product_id) => {
  if (process.env.DEV_ENV !== "production") return generateDummyFeedback();
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products/feedback/${product_id}`
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

export const addFeedback = async (id, payload) => {
  if (process.env.DEV_ENV !== "production") return payload;
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products/feedback/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    if (response.ok) {
      return { feedback: data, message: "Feedback added successfully" };
    } else {
      return {
        feedback: null,
        message: data.message,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      feedback: null,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
};
