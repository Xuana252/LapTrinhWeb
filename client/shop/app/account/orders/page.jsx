"use client";
import CollapsibleContainer from "@components/UI/CollapsibleBanner";
import Divider from "@components/UI/Divider";
import OrderItem from "@components/UI/OrderItem";
import { useSession } from "@node_modules/next-auth/react";
import Link from "@node_modules/next/link";
import { cancelOrder, getOrders } from "@service/order";
import { formattedDate, formattedPrice } from "@util/format";
import React, { useEffect, useState } from "react";
import {
  useDispatch,
  useSelector,
} from "@node_modules/react-redux/dist/react-redux";
import { toastError, toastRequest, toastSuccess } from "@util/toaster";
import { useRouter } from "@node_modules/next/navigation";
import { addCartItem } from "@service/cart";
import { addItem } from "@provider/redux/cart/cartSlice";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { faMoneyBill } from "@node_modules/@fortawesome/free-solid-svg-icons";
import Image from "@node_modules/next/image";

const Orders = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const session = useSelector((state) => state.session);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [selectedView, setSelectedView] = useState("All");
  const viewItems = [
    "All",
    "Pending",
    "Confirmed",
    "Shipping",
    "Delivered",
    "Cancelled",
  ];
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    setIsLoading(true);
    getOrders(session.customer?.customer_id).then((data) => {
      const sortedOrders = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    setOrders(sortedOrders);  // Update orders
      setTimeout(() => setIsLoading(false), 1000);
    });
  };

  const handleCancelOrder = async (id) => {
    const result = await toastRequest("Do you want to cancel this order?");
    if (result) {
      cancelOrder(session.customer?.customer_id, id);
      toastSuccess("Order cancelled successfully");

      setOrders(
        orders.map((order) => {
          if (order.order_id === id) {
            return { ...order, order_status: "CANCELLED" };
          }
          return order;
        })
      );
    }
  };

  const handleReorder = async (order) => {
    const result = await toastRequest("Do you want to reorder?");
    if (!result) return;

    try {
      // Add items to the cart in parallel
      await Promise.all(
        order.order_items.map(async (item) => {
          const data = await addCartItem(
            session.customer?.customer_id,
            item.product_id,
            item.quantity
          );
          if (data) {
            dispatch(
              addItem({
                product: item.product,
                quantity: item.quantity,
              })
            );
            toastSuccess(`${item.product.product_name} added to cart`);
          } else {
            toastError(`Failed to add ${item.product.product_name} to cart`);
          }
        })
      );

      // Navigate to cart after all items are processed
      router.push("/cart");
    } catch (error) {
      console.error("Error reordering items:", error);
      toastError("An error occurred while reordering. Please try again.");
    }
  };

  useEffect(() => {
    if (!session.isAuthenticated) return;
    fetchOrders();
  }, [session]);

  const renderActions = (order) => {
    switch (order.order_status) {
      case "PENDING":
        return (
          <button
            className="button-variant-2"
            onClick={() => handleCancelOrder(order.order_id)}
          >
            Cancel
          </button>
        );
      case "SHIPPED":
        return (
          <Link href={`/tracking?orderId=${order.order_id}`}>
            <button className="button-variant-2">Track</button>
          </Link>
        );
      case "DELIVERED":
        return (
          <button
            className="button-variant-2"
            onClick={() => handleReorder(order)}
          >
            Reorder
          </button>
        );
      case "CANCELLED":
        return (
          <button
            className="button-variant-2"
            onClick={() => handleReorder(order)}
          >
            Reorder
          </button>
        );
      case "CONFIRMED":
        return (
          <Link href={`/tracking?orderId=${order.order_id}`}>
            <button className="button-variant-2">Track</button>
          </Link>
        );
      default:
        return null;
    }
  };

  const renderPaymentMethod = (order) => {
    switch (order.payment_method) {
      case "MOMO":
        switch (order.payment_status) {
          case "PENDING":
            return (
              <div className="flex flex-row items-center gap-2 rounded-xl bg-gray-500/50  px-2 py-1 text-white">
                PENDING{" "}
                <Image
                  src={"/images/MoMo_Logo.png"}
                  alt="MOMO"
                  width={20}
                  height={20}
                />
              </div>
            );
          case "PAID":
            return (
              <div className="flex flex-row items-center gap-2 rounded-xl bg-green-500/50  px-2 py-1 text-white">
                PAID{" "}
                <Image
                  src={"/images/MoMo_Logo.png"}
                  alt="MOMO"
                  width={20}
                  height={20}
                />
              </div>
            );
          case "REFUNDED":
            return (
              <div className="flex flex-row items-center gap-2 rounded-xl bg-black/50  px-2 py-1 text-white">
                REFUNDED{" "}
                <Image
                  src={"/images/MoMo_Logo.png"}
                  alt="MOMO"
                  width={20}
                  height={20}
                />
              </div>
            );
        }
        case "ZALOPAY":
        switch (order.payment_status) {
          case "PENDING":
            return (
              <div className="flex flex-row items-center gap-2 rounded-xl bg-gray-500/50  px-2 py-1 text-white">
                PENDING{" "}
                <Image
                  src={"/images/ZaloPay_Logo.png"}
                  alt="MOMO"
                  width={20}
                  height={20}
                />
              </div>
            );
          case "PAID":
            return (
              <div className="flex flex-row items-center gap-2 rounded-xl bg-green-500/50  px-2 py-1 text-white">
                PAID{" "}
                <Image
                  src={"/images/ZaloPay_Logo.png"}
                  alt="MOMO"
                  width={20}
                  height={20}
                />
              </div>
            );
          case "REFUNDED":
            return (
              <div className="flex flex-row items-center gap-2 rounded-xl bg-black/50  px-2 py-1 text-white">
                REFUNDED{" "}
                <Image
                  src={"/images/ZaloPay_Logo.png"}
                  alt="MOMO"
                  width={20}
                  height={20}
                />
              </div>
            );
        }
      case "COD":
        switch (order.payment_status) {
          case "PENDING":
            return (
              <div className="flex flex-row items-center gap-2 rounded-xl bg-gray-500/50  px-2 py-1 text-white">
                PENDING <FontAwesomeIcon icon={faMoneyBill} />
              </div>
            );
          case "PAID":
            return (
              <div className="flex flex-row items-center gap-2 rounded-xl bg-green-500/50  px-2 py-1 text-white">
                PAID <FontAwesomeIcon icon={faMoneyBill} />
              </div>
            );
          case "REFUNDED":
            return (
              <div className="flex flex-row items-center gap-2 rounded-xl bg-black/50 px-2 py-1  text-white">
                REFUNDED <FontAwesomeIcon icon={faMoneyBill} />
              </div>
            );
        }
      default:
        return null;
    }
  };
  const renderStatus = (order) => {
    switch (order.order_status) {
      case "PENDING":
        return <div className="pending">{order.order_status}</div>;
      case "SHIPPED":
        return <div className="shipping">{order.order_status}</div>;
      case "DELIVERED":
        return <div className="delivered">{order.order_status}</div>;
      case "CANCELLED":
        return <div className="cancelled">{order.order_status}</div>;
      case "CONFIRMED":
        return <div className="confirmed">{order.order_status}</div>;
    }
  };
  return (
    <section className="w-full flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold">Orders</div>
        <div className="text-sm opacity-60">View your orders </div>
      </div>
      <Divider />
      <div>
        <div className="flex flex-row w-full overflow-x-scroll no-scrollbar  ">
          {viewItems.map((viewItem) => (
            <button
              key={viewItem}
              className={`grow text-center gap-2 min-w-[100px] p-2 hover:border-on-secondary/50 hover:border-b-2 ${
                selectedView === viewItem
                  ? "border-b-4 border-on-primary font-bold"
                  : ""
              }`}
              onClick={() => setSelectedView(viewItem)}
            >
              {viewItem}
            </button>
          ))}
        </div>
        <Divider />
      </div>
      <div className="flex flex-col justify-center  gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col bg-on-surface/20 rounded-lg p-2 gap-2"
              >
                <div className="rounded-lg bg-primary animate-pulse h-5 w-[200px]"></div>
                <Divider />
                <h2 className="h-7 rounded-lg bg-primary animate-pulse w-[200px]"></h2>
                <CollapsibleContainer
                  content={
                    <ul className="flex flex-col gap-4 py-4 w-full">
                      {Array.from({ length: 2 }).map((_, index) => (
                        <OrderItem key={index} loading={true} />
                      ))}
                    </ul>
                  }
                  maxHeight={200}
                />

                <div className="flex flex-row justify-between items-center">
                  <div className="h-6 rounded-lg bg-primary animate-pulse w-[80px]"></div>
                  <div className="flex gap-2 flex-wrap">
                    <div className="h-6 rounded-lg bg-primary animate-pulse w-[80px]"></div>
                    <div className="h-6 rounded-lg bg-primary animate-pulse w-[80px]"></div>
                  </div>
                </div>
              </div>
            ))
          : orders
              ?.filter(
                (item) =>
                  item.order_status.toLowerCase() ===
                    selectedView.toLowerCase() || selectedView === "All"
              )
              .map((item) => (
                <div
                  key={item.order_id}
                  className=" flex flex-col bg-on-surface/20 shadow-md rounded-lg p-2 gap-2"
                >
                  <div className="flex flex-wrap justify-between gap-4">
                    <h3>OrderID: {item.order_id}</h3>
                    <h3 className="opacity-70">
                      {formattedDate(item.created_at)}
                    </h3>
                  </div>
                  <Divider />
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                      {formattedPrice(item.total_price)}
                    </h2>

                    {renderPaymentMethod(item)}
                  </div>
                  <CollapsibleContainer
                    content={
                      <ul className="flex flex-col gap-4 py-4">
                        {item.order_items?.map((oi) => (
                          <OrderItem
                            key={oi.order_id + oi.product_id}
                            orderItem={oi}
                          />
                        ))}
                      </ul>
                    }
                    maxHeight={200}
                  />

                  <div className="flex flex-row justify-between items-center">
                    {renderStatus(item)}
                    <div className="flex gap-2 flex-wrap">
                      {renderActions(item)}
                    </div>
                  </div>
                </div>
              ))}
      </div>
    </section>
  );
};

export default Orders;
