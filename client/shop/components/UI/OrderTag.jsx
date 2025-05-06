import React from "react";
import Divider from "./Layout/Divider";
import CollapsibleContainer from "./CollapsibleBanner";
import OrderItem from "./OrderItem";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { faMoneyBill } from "@node_modules/@fortawesome/free-solid-svg-icons";
import Link from "@node_modules/next/link";
import { formattedDate, formattedPrice } from "@util/format";
import Image from "@node_modules/next/image";
import { renderPaymentMethod, renderStatus } from "@util/render";

const OrderTag = ({ order, loading, onReorder, onCancel }) => {
  const renderActions = (order) => {
    switch (order.order_status) {
      case "pending":
        return (
          <button
            className="button-variant-2"
            onClick={() => onCancel(order._id)}
          >
            Cancel
          </button>
        );
      case "shipped":
        return (
          <Link href={`/tracking?orderId=${order._id}`}>
            <button className="button-variant-2">Track</button>
          </Link>
        );
      case "delivered":
        return (
          <button className="button-variant-2" onClick={() => onReorder(order)}>
            Reorder
          </button>
        );
      case "cancelled":
        return (
          <button className="button-variant-2" onClick={() => onReorder(order)}>
            Reorder
          </button>
        );
      case "confirmed":
        return (
          <Link href={`/tracking?orderId=${order._id}`}>
            <button className="button-variant-2">Track</button>
          </Link>
        );
      default:
        return null;
    }
  };

 

  if (loading)
    return (
      <div className="flex flex-col bg-on-surface/20 rounded-lg p-2 gap-2">
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
    );
  return (
    <div className=" flex flex-col bg-on-surface/20 shadow-md rounded-lg p-2 gap-2">
      <div className="flex flex-wrap justify-between gap-4">
        <h3>OrderID: {order._id}</h3>
        <h3 className="opacity-70">{formattedDate(order.createdAt)}</h3>
      </div>
      <Divider />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {formattedPrice(order.total_price)}
        </h2>

        {renderPaymentMethod(order.payment_method)}
      </div>
      <CollapsibleContainer
        content={
          <ul className="flex flex-col gap-4 py-4">
            {order.order_item?.map((oi) => (
              <OrderItem key={oi.product_id._id} orderItem={oi} />
            ))}
          </ul>
        }
        maxHeight={200}
      />

      <div className="flex flex-row justify-between items-center">
        {renderStatus(order.order_status)}
        <div className="flex gap-2 flex-wrap">{renderActions(order)}</div>
      </div>
    </div>
  );
};

export default OrderTag;
