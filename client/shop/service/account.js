"use server";
import jwt from "jsonwebtoken";

const mockTokenPayload1 = {
  id: "68149573efa55695535541b4",
  email: "john.doe@gmail.com",
  name: "John Doe",
};

const mockTokenPayload2 = {
  id: "6821a22f8ce982d1e5e8e2d2",
  email: "john.moe@gmail.com",
  name: "John Moe",
};

const accessToken1 = jwt.sign(mockTokenPayload1, process.env.NEXTAUTH_SECRET, {
  expiresIn: "30d",
});

const accessToken2 = jwt.sign(mockTokenPayload2, process.env.NEXTAUTH_SECRET, {
  expiresIn: "30d",
});

const data1 = {
  token: accessToken1,
  expires_in: 3600 * 24 * 30, // seconds
};

const data2 = {
  token: accessToken2,
  expires_in: 3600 * 24 * 30, // seconds
};

export const changePassword = async (id,payload) => {

  try {
    // Send the PATCH request to update the password
    const patchResponse = await fetch(
      `${process.env.APP_URL}/users/changePassword/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (patchResponse.ok) {
      return {
        status: true,
        message: "Password changed successfully. Please login again",
      };
    } else {
      return { status: false, message: "Failed to update password." };
    }
  } catch (error) {
    console.log("An error occurred:", error);
    return {
      status: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
};

export const login = async (payload) => {
  const { email, password } = payload;

  if (process.env.DEV_ENV !== "production") {
    if (email === "john.doe@gmail.com" && password === "11111111") {
      return { statusCode: 200, data: data1 };
    } else if (email === "john.moe@gmail.com" && password === "11111111") {
      return { statusCode: 200, data: data2 };
    } else {
      return { statusCode: 401, data: null };
    }
  } else {
    try {
      const response = await fetch(`${process.env.APP_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const statusCode = response.status;

      if (response.ok) {
        const data = await response.json();
        return { statusCode, data };
      }

      // Handle cases where response is not OK but a status code exists
      return { statusCode, data: null };
    } catch (error) {
      console.error(error);
      return { statusCode: null, error: error.message }; // Add error details
    }
  }
};
