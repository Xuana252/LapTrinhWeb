"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/UI/Map"), {
  ssr: false,
});
import InputBox from "@components/Input/InputBox";
import OrderItem from "@components/UI/OrderItem";
import {
  faCancel,
  faCircleCheck,
  faCircleXmark,
  faCreditCard,
  faHouse,
  faMoneyBill,
  faPhone,
  faSearch,
  faSpinner,
  faTruckFast,
  faTruckRampBox,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "@node_modules/next-auth/react";
import { useSearchParams } from "@node_modules/next/navigation";
import { useSelector } from "@node_modules/react-redux/dist/react-redux";
import { getOrder } from "@service/order";
import { formattedPrice, formattedDate } from "@util/format";
import { renderPaymentMethod, renderStatus } from "@util/render";
import { toastError, toastWarning } from "@util/toaster";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Tracking() {
  const session = useSelector((state) => state.session);
  const [isLoading, setIsLoading] = useState(false);
  const [orderIdInput, setOrderIdInput] = useState("");
  const [orderIdPending, setOrderIdPending] = useState("");
  const [order, setOrder] = useState();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  const fetchOrder = async (id = "") => {
    if (!id) {
      toastWarning("Please type in your orderId");
      return;
    }
    setIsLoading(true);
    try {
      const data = await getOrder(session?.customer?._id, id);
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order:", error);
      toastError("Could not fetch order details.");
    } finally {
      setIsLoading(false);
    }
  };

  const trackOrder = () => {
    setOrderIdInput(orderIdPending);
  };

  useEffect(() => {
    setOrderIdInput(orderId);
    setOrderIdPending(orderId);
  }, [orderId]);

  useEffect(() => {
    if (orderIdInput) {
      setOrderIdInput(orderIdInput);
      fetchOrder(orderIdInput);
    }
  }, [orderIdInput]);

  return (
    <section className="size-full flex justify-center">
      <div className="flex flex-col gap-10 w-full">
        <div className="relative  w-full flex flex-col gap-2">
          <ul className="flex flex-row items-center justify-between ">
            <li className="relative flex items-center justify-center rounded-full size-4 md:size-6 bg-on-background">
              {order?.order_status === "cancelled" && (
                <span className="bg-background rounded-full size-2 md:size-3 absolute"></span>
              )}
            </li>
              <li className="grow border-t-4 border-on-background"></li>
            <li className="relative flex items-center justify-center rounded-full size-4 md:size-6 bg-on-background">
              {order?.order_status === "pending" && (
                <span className="bg-background rounded-full size-2 md:size-3 absolute"></span>
              )}
            </li>
            <li className="grow border-t-4 border-on-background"></li>
            <li className="relative flex items-center justify-center rounded-full size-4 md:size-6 bg-on-background">
              {order?.order_status === "processing" && (
                <span className="bg-background rounded-full size-2 md:size-3 absolute"></span>
              )}
            </li>
            <li className="grow border-t-4 border-on-background"></li>
            <li className="relative flex items-center justify-center rounded-full size-4 md:size-6 bg-on-background">
              {order?.order_status === "shipped" && (
                <span className="bg-background rounded-full size-2 md:size-3 absolute"></span>
              )}
            </li>
            <li className="grow border-t-4 border-on-background"></li>
            <li className="relative flex items-center justify-center rounded-full size-4 md:size-6 bg-on-background">
              {order?.order_status === "delivered" && (
                <span className="bg-background rounded-full size-2 md:size-3 absolute"></span>
              )}
            </li>
          </ul>
          <ul className="flex flex-row items-center justify-between text-xl">
            <li>
              <FontAwesomeIcon icon={faCircleXmark} />
            </li>
            <li>
              <FontAwesomeIcon icon={faSpinner} />
            </li>
            <li>
              <FontAwesomeIcon icon={faTruckRampBox} />
            </li>
            <li>
              <FontAwesomeIcon icon={faTruckFast} />
            </li>
            <li>
              <FontAwesomeIcon icon={faCircleCheck} />
            </li>
          </ul>
        </div>

        <Map
          key={order?._id}
          to={
            (order?.address.ward ?? "") +
            ", " +
            (order?.address.district ?? "") +
            ", " +
            (order?.address.province ?? "")
          }
          status={order?.order_status}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
          <div className="panel-1">
            <div className="flex flex-col md:flex-row gap-2 items-starts justify-between">
              <div className="flex flex-row gap-2 grow items-center">
                <h3 className="font-bold text-lg">Order id:</h3>
                <div>
                  <InputBox
                    value={orderIdPending}
                    onChange={setOrderIdPending}
                  />
                </div>
                <button
                  className="button-variant-1 size-12 text-2xl"
                  onClick={trackOrder}
                >
                  {isLoading ? (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faSearch} />
                  )}
                </button>
              </div>
              {renderStatus(order?.order_status)}
            </div>
            <div className=" w-full border-t-2 border-on-secondary my-4"></div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <h3 className="text-lg">Delivery estimate</h3>
              <h3 className="text-lg">{formattedDate(order?.createdAt, 3)}</h3>
            </div>
            <div className=" w-full border-t-2 border-on-secondary my-4"></div>
            <div className="flex flex-col gap-2 items-start">
              <h3 className="text-lg font-bold">{order?.address?.name}</h3>
              <div className="grid grid-cols-[auto_1fr] gap-2 items-baseline">
                <FontAwesomeIcon icon={faHouse} />
                <p>
                  {order?.address.detailed_address ?? ""},{" "}
                  {order?.address.ward ?? ""},{order?.address.district ?? ""},{" "}
                  {order?.address.province ?? ""}
                </p>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-2 items-baseline">
                <FontAwesomeIcon icon={faPhone} />
                <p>{order?.address?.phone_number || ""}</p>
              </div>
            </div>
            <div className=" w-full border-t-2 border-on-secondary my-4"></div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <h3 className="text-lg">Payment method</h3>
              <h3 className="text-lg">
                {renderPaymentMethod(order?.payment_method)}
              </h3>
            </div>
          </div>
          <div className="panel-1">
            <div className="flex flex-col md:flex-row gap-2 items-start justify-between">
              <div className="flex flex-row gap-2 grow items-center">
                <h3 className="font-bold text-lg">Order id:</h3>
                <h3 className="font-bold ">{order?.order_id}</h3>
              </div>
              <div className="text-xl">
                <span className="font-bold">
                  {formattedPrice(order?.total_price)}{" "}
                </span>{" "}
                ({order?.order_items?.length} items)
              </div>
            </div>
            <div className=" w-full border-t-2 border-on-secondary my-4"></div>
            <ul className="flex flex-col gap-4">
              {isLoading
                ? Array.from({ length: 2 }).map((_, index) => (
                    <OrderItem key={index} loading={true} />
                  ))
                : order?.order_item?.map((item) => (
                    <OrderItem key={item.product_id._id} orderItem={item} />
                  ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
