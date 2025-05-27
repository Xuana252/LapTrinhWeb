"use server";

import { generateDummyFeedback } from "@util/generator/feedback";

export const getFeedbacks  = async(product_id) =>  {
  if(process.env.DEV_ENV !=="production") return generateDummyFeedback()
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products/feedback/${product_id}`
    );
    if(response.ok) {
      const data  = await response.json()
      return data
    } else {
      return []
    }
  } catch (error) {
    console.log(error)
    return []
  }
}

export const addFeedback = async (payload) => {
  if(process.env.DEV_ENV !=="production") return payload
  try {
    const response = await fetch(
      `${process.env.APP_URL}/products/feedback/${payload.product_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: payload.customer_id,
          feedback: payload.feedback,
          rating: payload.rating,
        }),
      }
    ); 

    if(response.ok) {
      const data = await response.json()
      return data
    } else {
      return null
    }
  } catch (error) {
    console.log(error)
    return null
  }
};
