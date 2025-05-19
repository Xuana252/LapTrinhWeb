"use server";

export const fetchNotification = async (customer_id, skip, limit) => {
  try {
    const response = await fetch(
      `${process.env.APP_URL}/realtime/notification/${customer_id}?skip=${skip}&limit=${limit}`
    );
    if (response.ok) {
      const data = await response.json();
      return {
        notifications: data.notifications,
        unreadCount: data.unreadCount,
      };
    } else {
      return { notifications: [], unread: 0 };
    }
  } catch (error) {
    console.log(error);
    return { notifications: [], unread: 0 };
  }
};

export const readNotification = async (customer_id, notification_id) => {
  try {
    const response = await fetch(
      `${process.env.APP_URL}/realtime/notification/${customer_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notification_id),
      }
    );
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

export const deleteNotification = async (customer_id, notification_id) => {
  try {
    const response = await fetch(
      `${process.env.APP_URL}/realtime/notification/${customer_id}/${notification_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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

export const clearNotification = async (customer_id) => {
  try {
    const response = await fetch(
      `${process.env.APP_URL}/realtime/notification/${customer_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
