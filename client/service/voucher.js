"use server";
import { generateDummyVouchersData } from "@util/generator/voucher";

export const getVouchers = async () => {
  if (process.env.DEV_ENV !== "production")
    return generateDummyVouchersData(Math.round(Math.random() * 10) + 1);
  try {
    const response = await fetch(`${process.env.APP_URL}/vouchers`)
    if(response.ok) {
        const data = await response.json()
        return data
    } else {
        return []
    }
  } catch (error) {
    console.log(error)
    return[]
  }
};

