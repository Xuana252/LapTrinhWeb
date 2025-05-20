"use client";
import CollapsibleContainer from "@components/UI/CollapsibleBanner";
import Divider from "@components/UI/Layout/Divider";
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
import OrderTag from "@components/UI/OrderTag";

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
    getOrders(session.customer?._id).then((data) => {
      const sortedOrders = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sortedOrders); // Update orders
      setTimeout(() => setIsLoading(false), 1000);
    });
  };

  const handleCancelOrder = async (id) => {
    const result = await toastRequest("Do you want to cancel this order?");
    if (result) {
      cancelOrder(id).then((data) => {
        if (data) {
          toastSuccess("Order cancelled successfully");
          setOrders(
            orders.map((order) => {
              if (order._id === id) {
                return { ...order, order_status: "cancelled" };
              }
              return order;
            })
          );
        } else {
          toastError("Failed to cancel order");
        }
      });
    }
  };

  const handleReorder = async (order) => {
    const result = await toastRequest("Do you want to reorder?");
    if (!result) return;

    try {
      // Add items to the cart in parallel
      await Promise.all(
        order.order_item.map(async (item) => {
          const data = await addCartItem(
            session.customer?._id,
            item.product_id._id,
            item.quantity
          );
          if (data) {
            dispatch(
              addItem({
                product: item.product_id,
                quantity: item.quantity,
              })
            );
            toastSuccess(`${item.product_id.product_name} added to cart`);
          } else {
            toastError(`Failed to add ${item.product_id.product_name} to cart`);
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
  }, [session?.customer?._id]);

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
              <OrderTag key={index} loading={true} />
            ))
          : orders
              ?.filter(
                (item) =>
                  item.order_status.toLowerCase() ===
                    selectedView.toLowerCase() || selectedView === "All"
              )
              .map((item) => (
                <OrderTag
                  order={item}
                  key={item._id}
                  loading={false}
                  onReorder={handleReorder}
                  onCancel={handleCancelOrder}
                />
              ))}
      </div>
    </section>
  );
};

export default Orders;
