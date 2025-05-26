"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/UI/Map"), {
  ssr: false,
});
import OrderItemTab from "@components/UI/Order/OrderItemsTab";
import CustomStatusDropdown from "@components/UI/Order/StatusDropdown";
import { useParams } from "@node_modules/next/navigation";
import { changeOrderState, getOrder } from "@service/order";
import { formattedPrice, normalizeVietnameseAddressNoMark } from "@util/format";
import { useEffect, useState } from "react";
import {
  faSave,
  faSpinner,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { toastError, toastSuccess } from "@util/toaster";
import CustomerRevenueTab from "@components/UI/Customer/CustomerRevenueTab";

const OrderInfo = () => {
  const param = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const getImageLogo = (method) => {
    switch (method.toLowerCase()) {
      case "cod":
        return "/";
      case "momo":
        return "/images/MoMo_Logo.png";
      case "zalo":
        return "/images/ZaloPay_Logo.png";
      default:
        return "/";
    }
  };

  const saveState = () => {
    if (!status) return;
    setIsLoading(true);
    changeOrderState(param.id, status).then((result) => {
      if (result) {
        toastSuccess("Order state updated");
      } else {
        toastError("Failed to update order state");
      }
    });
    setTimeout(() => setIsLoading(false), 1000);
  };

  const fetchOrder = () => {
    setIsLoading(true);
    getOrder(param.id)
      .then((res) => {
        setOrder(res);
        setStatus(res.order_status);
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => setIsLoading(false), 1000);
  };

  useEffect(() => {
    fetchOrder();
  }, [param.id]);
  return (
    <section className="w-full h-fit flex flex-col items-center gap-4 overflow-visible">
      <div className="panel-3 w-full font-bold ">Order: {order?._id}</div>
      {isLoading ? (
        <div className="h-[500px] w-full rounded animate-pulse bg-surface"></div>
      ) : (
        <Map
          key={order?._id}
          to={normalizeVietnameseAddressNoMark(
            order?.address.ward ?? "",
            order?.address.district ?? "",
            order?.address.province ?? ""
          )}
          status={order?.order_status}
        />
      )}
      {isLoading ? (
        <div className="bg-surface h-[300px] w-full animate-pulse rounded"></div>
      ) : (
        <div className="rounded panel-2 w-full p-4 gap-4 grid  md:grid-cols-[auto_1fr] justify-center">
          <h2 className="font-semibold  w-40">Address</h2>
          <div className="panel-4 ">
            <p className="text-lg font-semibold mb-1">{order?.address?.name}</p>
            <p className="opacity-70">{order?.address?.phone_number}</p>
            <p className="text-sm">
              {order?.address
                ? `${order?.address.detailed_address}, ${order?.address.district}, ${order?.address.ward}, ${order?.address.province}`
                : ""}
            </p>
          </div>

          <h2 className="font-semibold  w-40">Total Price</h2>
          <div className="panel-4 ">{formattedPrice(order?.total_price)}</div>

          <h2 className="font-semibold  w-40">Payment Method</h2>
          <div className="panel-4 flex items-center">
            {order?.payment_method === "cod" ? null : (
              <img
                src={getImageLogo(order?.payment_method || "cod")}
                alt={order?.payment_method || "..."}
                className="w-8 h-auto mr-3"
              />
            )}
            {order?.payment_method}
          </div>

          <h2 className="font-semibold  w-40">Order Status</h2>
          <div className="flex items-center gap-4">
            <CustomStatusDropdown value={status} onChange={setStatus} />
          </div>
        </div>
      )}

      <div className="panel-3 w-full flex justify-end">
        <button
          onClick={saveState}
          className="bg-green-500  text-white p-1 rounded-lg active:opacity-80 transition-colors duration-200 ease-out gap-2 flex items-center justify-center h-fit"
        >
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : (
            <>
              Save
              <FontAwesomeIcon icon={faSave} />
            </>
          )}
        </button>
      </div>
      <div className="w-full">
        <OrderItemTab
          orderItems={order?.order_item ?? []}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
};

export default OrderInfo;
