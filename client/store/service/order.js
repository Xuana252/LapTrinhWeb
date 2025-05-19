"use server";

import {
  generateDummyOrdersData,
  generateDummyOrderData,
  generateMockOrderData,
  generateMockRevenueData,
} from "@util/generator/order";

export const getOrder = async (id) => {
  if (process.env.DEV_ENV !== "production") return generateDummyOrderData();
  try {
    const response = await fetch(
      `${process.env.APP_URL}/orders/${id}?page${page}&status=${status}&created`
    );
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

export const getCustomerOrders = async (id) => {
  if (process.env.DEV_ENV !== "production") return generateDummyOrdersData(Math.round(Math.random()*4)+1);
  try {
    const response = await fetch(`${process.env.APP_URL}/orders/${id}`);
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

export const getAllOrder= async ()=>{
  if(process.env.DEV_ENV!=="production") return generateDummyOrdersData(20)
  try {
    const response =await fetch(
      `${process.env.APP_URL}/orders/`
    )
    if(response.ok)
    {
      const data=await response.json()
      return data
    }
    else{
      return {}
    }
  } catch (error) {
    console.log(error)
    return{}
  }
}

export const cancelOrder = async (customer_id,id) => {
  try {
    const response = await fetch(`${process.env.APP_URL}/orders/${customer_id}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        	"order_status": "CANCELLED"
      }),
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




export const getOrderData  = async () =>  {
  return generateMockOrderData()
  // if(process.env.DEV_ENV!=="production") return generateDummyOrdersData(10)
  // try {
  //   const response = await fetch(
  //     `${process.env.APP_URL}/orders`
  //   );
  //   if(response.ok) {
  //     const data  = await response.json()
  //     return data
  //   } else {
  //     return []
  //   }
  // } catch (error) {
  //   console.log(error)
  //   return []
  // }
}

export const getRevenueData = async () => {
  return generateMockRevenueData(6)
  // if(process.env.DEV_ENV!=="production") return generateDummyOrdersData(10)
  // try {
  //   const response = await fetch(
  //     `${process.env.APP_URL}/orders`
  //   );
  //   if(response.ok) {
  //     const data  = await response.json()
  //     return data
  //   } else {
  //     return []
  //   }
  // } catch (error) {
  //   console.log(error)
  //   return []
  // }
}



