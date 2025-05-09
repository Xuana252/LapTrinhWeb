"use client";
import CollapsibleContainer from "@components/UI/CollapsibleBanner";
import Divider from "@components/UI/Layout/Divider";
import { useSession } from "@node_modules/next-auth/react";
import Link from "@node_modules/next/link";
import { getCustomerOrders } from "@service/order";
import React, { useEffect, useState } from "react";
import OrderTag from "@components/UI/OrderTag";
import {
  faAngleLeft,
  faAngleRight,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";

const CustomerOrdersTab = ({ id }) => {
  const ORDER_LIMIT = 4;
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchCustomerOrders = () => {
    setIsLoading(true);
    getCustomerOrders(id).then((data) => {
      const sortedOrders = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sortedOrders); // Update orders
    });
    setTimeout(() => setIsLoading(false), 1000);
  };

  useEffect(()=>{setPage(1)},[selectedView])
  useEffect(() => {
    id && fetchCustomerOrders();
  }, [id]);

  const filteredOrders = orders?.filter(
    (item) =>
      item.order_status.toLowerCase() === selectedView.toLowerCase() ||
      selectedView === "All"
  );

  return (
    <section className="w-full flex flex-col gap-2 panel-3 ">
      <div className=" flex flex-row w-full overflow-auto ">
        {viewItems.map((viewItem) => (
          <button
            key={viewItem}
            className={`grow text-center relative gap-2 min-w-[100px] p-2 hover:border-on-secondary/50 hover:border-b-2 ${
              selectedView === viewItem
                ? "border-b-4 border-on-primary font-bold"
                : ""
            }`}
            onClick={() => setSelectedView(viewItem)}
          >
            {orders?.filter(
              (item) =>
                item.order_status.toLowerCase() === viewItem.toLowerCase()
            ).length > 0 && (
              <div className="absolute top-0 right-0 bg-green-500 flex items-center justify-center size-[16px] aspect-square text-white rounded-full font-normal  text-xs">
                {
                  orders?.filter(
                    (item) =>
                      item.order_status.toLowerCase() === viewItem.toLowerCase()
                  ).length
                }
              </div>
            )}
            {viewItem}
          </button>
        ))}
      </div>

      <Divider />

      {/* order list */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-visible">
        {isLoading
          ? Array.from({ length: ORDER_LIMIT }).map((_, index) => (
              <OrderTag key={index} loading={true} />
            ))
          : filteredOrders
              .slice((page - 1) * ORDER_LIMIT, page * ORDER_LIMIT)
              .map((item) => (
                <OrderTag order={item} key={item._id} loading={false} />
              ))}
      </ul>
      {/* page selector */}
      <ul className="flex my-4 gap-2 flex-row items-center justify-center bg-background/20 backdrop-blur-sm rounded-xl size-fit m-auto">
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
              Math.min(page + 1, Math.ceil(filteredOrders.length / ORDER_LIMIT))
            )
          }
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </ul>
    </section>
  );
};

export default CustomerOrdersTab;
