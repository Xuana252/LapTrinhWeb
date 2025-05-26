import { generateDummyCustomerData } from "./customer";
import { generateDummyProductData } from "./product";

const ORDER_STATUS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_METHOD = ["cod", "momo", "zalopay"];

export const generateDummyOrderData = () => {
  const dummyCustomer = generateDummyCustomerData();

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
    order_status:
      ORDER_STATUS[Math.floor(Math.random() * ORDER_STATUS.length)],
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

export const generateDummyOrdersData = (num = 1) => {
  const orders_list = [];

  for (let i = 0; i < num; i++) {
    orders_list.push(generateDummyOrderData());
  }

  return orders_list;
};
