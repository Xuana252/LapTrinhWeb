const ORDER_STATUS = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const PAYMENT_METHOD = ["cod", "momo", "zalopay"];

export const generateDummyOrderData = () => {
  const dummyCustomer = {
    customer_id: "cust_12345",
    username: "john_doe",
    full_name: "John Doe",
    phone_number: "123-456-7890",
    date_joined: new Date().toISOString(),
    account: {
      email: "john.doe@example.com",
    },
  };

  const generateRandomProduct = (id) => ({
    product_id: `prod_${id}`,
    product_name: `Sample Product ${id}`,
    description: "This is a sample product description.",
    price: Math.floor(Math.random() * 50000000) + 5000000, // Random price between 50,000 and 150,000
    discount: Math.floor(Math.random() * 70) + 10, // Random discount up to 5000
    stock_quantity: 50,
    categories: [
      {
        category_id: 1,
        category_name: "Electronics",
        description: "Electronic devices and gadgets",
      },
    ],
    attributes: [
      { id: 1, name: "Color", detail: "Black" },
      { id: 2, name: "Size", detail: "Medium" },
    ],
    images: [
      "https://cdn.viettelstore.vn/Images/Product/ProductImage/1743276577.jpeg",
    ],
  });

  const generateRandomOrderItems = () => {
    const numberOfItems = Math.floor(Math.random() * 5) + 1; // 1 to 5 items
    const items = [];

    for (let i = 0; i < numberOfItems; i++) {
      const product = generateRandomProduct(i + 1);
      const quantity = Math.floor(Math.random() * 5) + 1; // 1 to 5 units
      const unit_price =
        product.price - (product.price * product.discount) / 100;
      const total_price = quantity * unit_price;

      items.push({
        order_id: "order_12345",
        product_id: product.product_id,
        product,
        quantity,
        unit_price,
        total_price,
      });
    }

    return items;
  };

  const dummyOrderItems = generateRandomOrderItems();

  const dummyShippingAddress = {
    shipping_status: ORDER_STATUS[2], // Example: SHIPPED
    delivery_date: new Date().toISOString(),
    address: {
      name: "John Doe",
      phone_number: "0987654321",
      detailed_address: "322 ấp Bình Thuận",
      province: "Thành Phố Hồ Chí Minh",
      district: "Huyện Cần Giờ",
      ward: "Xã Bình Khánh",
    },
  };

  const dummyOrder = {
    order_id: "order_" + Math.round(Math.random() * 1000).toString(),
    customer_id: dummyCustomer.customer_id,
    customer: dummyCustomer,
    order_status: ORDER_STATUS[Math.floor(Math.random() * ORDER_STATUS.length)],
    payment_method:
      PAYMENT_METHOD[Math.floor(Math.random() * PAYMENT_METHOD.length)],
    total_price: dummyOrderItems.reduce(
      (sum, item) => sum + item.total_price,
      0
    ),
    voucher_code: "DISCOUNT10",
    created_at: new Date().toISOString(),
    shipping_address: dummyShippingAddress,
    order_items: dummyOrderItems,
  };

  return dummyOrder;
};

export const generateDummyOrdersData = (num = 1) => {
  const orders_list = [];

  for (let i = 0; i < num; i++) {
    orders_list.push(generateDummyOrderData());
  }

  return orders_list;
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
      count: Math.floor(Math.random() * 200000000) + 100000000,
    };
  });

  return {
    total: monthly.reduce((acc, curr) => acc + curr.count, 0),
    monthly,
  };
};
