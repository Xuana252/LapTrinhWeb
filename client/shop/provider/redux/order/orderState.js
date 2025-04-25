"use server";

import { cookies } from "next/headers";  // Correct import path
import { NextResponse } from "next/server";  // Import NextResponse

export async function changeOrderingState(state) {
  // Ensure that state is a number
  const stateValue = typeof state === "number" ? state : Number(state);

  // Get the cookies object for setting cookies
  const cookieStore = cookies();

  // Set the "OrderingState" cookie
  cookieStore.set("OrderingState", stateValue.toString(), {
    // Cookie options
    path: "/",  // Ensure the cookie is accessible site-wide
    maxAge: 60 * 60 * 24,  // Cookie expires in 1 day
  });

  // Return the state value as a number
  return stateValue;
}

export async function getOrderingState() {
  const cookieStore = cookies();
  // Get the "OrderingState" cookie
  const orderingState = cookieStore.get("OrderingState");

  // Parse the cookie value to a number
  const state = orderingState ? Number(orderingState) : 0;  // Default to 0 if no cookie is found

  return state;
}
