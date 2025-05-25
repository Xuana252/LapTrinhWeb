"use client";
import CollapsibleContainer from "@components/UI/CollapsibleBanner";
import Divider from "@components/UI/Layout/Divider";
import OrderItem from "@components/UI/OrderItem";
import { useSession } from "@node_modules/next-auth/react";
import Link from "@node_modules/next/link";
import { cancelOrder, getOrders } from "@service/order";
import { formattedDate, formattedPrice } from "@util/format";
import React, { useEffect, useRef, useState } from "react";
import {
  useDispatch,
  useSelector,
} from "@node_modules/react-redux/dist/react-redux";
import { toastError, toastRequest, toastSuccess } from "@util/toaster";
import { useRouter } from "@node_modules/next/navigation";
import { addCartItem } from "@service/cart";
import { addItem } from "@provider/redux/cart/cartSlice";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faMoneyBill,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import Image from "@node_modules/next/image";
import OrderTag from "@components/UI/OrderTag";

const Orders = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const session = useSelector((state) => state.session);
  const fetchFlag = useRef(true);
  // const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [selectedView, setSelectedView] = useState("All");
  const ORDER_LIMIT = 5;
  const [page, setPage] = useState(1);
  const viewItems = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];
  const [orders, setOrders] = useState([]);

  useEffect(() => setPage(1), [selectedView]);

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
    if (session?.customer?._id && fetchFlag.current) {
      fetchOrders();
      fetchFlag.current = false;
    }
  }, [session]);

  const filteredOrders = orders?.filter(
    (item) =>
      item.order_status.toLowerCase() === selectedView.toLowerCase() ||
      selectedView === "All"
  );

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
              className={`relative grow text-center gap-2 min-w-[100px] p-2 hover:border-on-secondary/50 hover:border-b-2 ${
                selectedView === viewItem
                  ? "border-b-4 border-on-primary font-bold"
                  : ""
              }`}
              onClick={() => setSelectedView(viewItem)}
            >
              {orders?.filter(
                (item) =>
                  item.order_status.toLowerCase() === viewItem.toLowerCase() ||
                  viewItem === "All"
              ).length >0  && (
                <span className="absolute top-0 right-0  text-xs font-semibold bg-green-500 text-white rounded-full aspect-square size-4">
                  {
                    orders?.filter(
                      (item) =>
                        item.order_status.toLowerCase() ===
                          viewItem.toLowerCase() || viewItem === "All"
                    ).length
                  }
                </span>
              )}
              {viewItem}
            </button>
          ))}
        </div>
        <Divider />
      </div>
      <div className="flex flex-col  gap-4 max-h-screen overflow-y-auto">
        {isLoading
          ? Array.from({ length: ORDER_LIMIT }).map((_, index) => (
              <OrderTag key={index} loading={true} />
            ))
          : filteredOrders
              .slice((page - 1) * ORDER_LIMIT, page * ORDER_LIMIT)
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
      <ul className="flex my-2 gap-2 flex-row items-center justify-center bg-background/20 backdrop-blur-sm rounded-xl size-fit m-auto">
        <button
          className="p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10"
          onClick={() => setPage(Math.max(page - 1, 1))}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        {Array.from({
          length: Math.ceil(filteredOrders.length / ORDER_LIMIT),
        }).map((_, index) => (
          <button
            key={index}
            className={`${
              page === index + 1 ? "bg-surface" : ""
            } p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10`}
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10"
          onClick={() =>
            setPage(
              Math.min(
                page + 1,
                Math.ceil(filteredProducts.length / PRODUCT_LIMIT)
              )
            )
          }
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </ul>
    </section>
  );
};

export default Orders;
