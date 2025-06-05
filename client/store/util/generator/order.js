import { randomImage } from "./customer";
import { generateDummyProductData } from "./product";

const ORDER_STATUS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_METHOD = ["cod", "momo", "zalo"];

export const generateDummyOrderData = () => {
  
  const dummyCustomer = {
    image: randomImage(),
    customer_id: "cust_12345",
    full_name: "John Doe",
    username: "john_doe",
    phone_number: "123-456-7890",
    date_joined: new Date().toISOString(),
    account: {
      email: "john.doe@example.com",
    },
  };

  const generateRandomOrderItems = () => {
    const numberOfItems = Math.floor(Math.random() * 5) + 1; // 1 to 5 items
    const items = [];

    for (let i = 0; i < numberOfItems; i++) {
      const product = generateDummyProductData()[0];
      const quantity = Math.floor(Math.random() * 5) + 1; // 1 to 5 units
      const price =
        product.price -
        (product.price *
          Math.max(product.discount + product.category.discount, 0)) /
          100;

      items.push({
        product_id: product,
        quantity,
        price,
      });
    }

    return items;
  };

  const dummyOrderItems = generateRandomOrderItems();

  const dummyShippingAddress = {
    name: "John Doe",
    phone_number: "0987654321",
    detailed_address: "322 Ấp Bình Thuận",
    province: "Thành Phố Hồ Chí Minh",
    district: "Huyện Cần Giờ",
    ward: "Xã Bình Khánh",
  };

  const dummyOrder = {
    _id: "order_" + Math.round(Math.random() * 1000).toString(),
    user_id: dummyCustomer,
    order_status: ORDER_STATUS[Math.floor(Math.random() * ORDER_STATUS.length)],
    payment_method:
      PAYMENT_METHOD[Math.floor(Math.random() * PAYMENT_METHOD.length)],
    total_price: dummyOrderItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ),
    createdAt: new Date().toISOString(),
    address: dummyShippingAddress,
    order_item: dummyOrderItems,
  };

  return dummyOrder;
};

export const generateDummyOrdersData = (num = 10) => {
  let orders_list = [];

  for (let i = 0; i < num; i++) {
    orders_list.push(generateDummyOrderData());
  }

  return {orders:orders_list,count: Math.floor(Math.random() * 30 + 20)};
};




export const generateMockOrderData = (months = 6) => {
  const now = new Date();

  // Today's counts
  const todayCount = Math.floor(Math.random() * 200);
  const todayPending = Math.floor(Math.random() * (todayCount + 1));

  // Total counts
  const totalOrders = Math.floor(Math.random() * 5000) + 5000;
  const totalDelivered = Math.floor(Math.random() * totalOrders);
  const totalCancelled = Math.floor(
    Math.random() * (totalOrders - totalDelivered)
  );
  const totalPending = totalOrders - totalDelivered - totalCancelled;

  // Monthly breakdown
  const monthly = Array.from({ length: months }, (_, i) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (months - i - 1),
      1
    );

    const orders = Math.floor(Math.random() * 600) + 400; // total for the month
    const pending = Math.floor(Math.random() * orders);
    const delivered = Math.floor(Math.random() * (orders - pending));
    const cancelled = orders - pending - delivered;

    return {
      _id: {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // JS months are 0-indexed
      },
      count: {
        order: orders,
        pending,
        cancelled,
        delivered,
      },
    };
  });

  return {
    today: todayCount,
    todayPending,
    order: totalOrders,
    pending: totalPending,
    delivered: totalDelivered,
    cancelled: totalCancelled,
    monthly,
  };
};

export const generateMockRevenueData = (months = 6) => {
  const now = new Date();
  const monthly = Array.from({ length: months }, (_, i) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (months - i - 1),
      1
    );
    return {
      _id: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
      },
      revenue: Math.floor(Math.random() * 200000000) + 100000000,
    };
  });

  return {
    total: monthly.reduce((acc, curr) => acc + curr.count, 0),
    monthly,
  };
};
