"use server";

// export const getMessages = async (id) => {
//   if (process.env.DEV_ENV !== "production")
//     return generateMockInboxRoom()
//   try {
//     const response = await fetch(`${process.env.APP_URL}/customer-inbox/${id}`)
//     if(response.ok) {
//         const data = await response.json()
//         return data
//     } else {
//         return null
//     }
//   } catch (error) {
//     console.log(error)
//     return null
//   }
// };

// export const getAllMessages = async (searchText, page, limit) => {
//   try {
//     const response = await fetch(
//       `${process.env.APP_URL}/realtime/message?searchText=${searchText}&page=${page}&limit=${limit}`
//     );
//     if (response.ok) {
//       const data = await response.json();
//       return data;
//     } else {
//       return [];
//     }
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// };

export const sendMessage = async (id, payload) => {
  // if (process.env.DEV_ENV !== "production") return payload
  try {
    const response = await fetch(
      `${process.env.APP_URL}/realtime/message/${id}`,
      {
        method: "PATCH",
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
