"use client";

import CustomStatusDropdown from "@components/UI/Order/StatusDropdown";
import {
  faBoxOpen,
  faClock,
  faQuestion,
  faSpinner,
  faTimesCircle,
  faTruck,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useParams } from "@node_modules/next/navigation";
import { getOrder } from "@service/order";
import { useEffect, useState } from "react";

const OrderInfo = () => {
  const param = useParams();
  const [order, setOrder] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

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
    <section className="size-full h-fit flex flex-col items-center gap-4 overflow-visible">
      {console.log(order)}
      <div className="rounded panel-2 w-full p-4 gap-4 flex flex-col mt-5 justify-center">
        <div className="flex justify-between gap-4">
          <h2 className="font-bold text-lg w-40">Order Id</h2>
          <div className="panel-4 flex-1">{order._id}</div>
        </div>

        <div className="flex justify-between gap-4">
          <h2 className="font-bold text-lg w-40">Address</h2>
          <div className="panel-4 flex-1 space-y-1">
            <p className="text-lg font-semibold my-2">{order.address?.name}</p>
            <p>{order.address?.phone_number}</p>
            <p>
              {order.address
                ? `${order.address.detailed_address}, ${order.address.district}, ${order.address.ward}, ${order.address.province}`
                : ""}
            </p>
          </div>
        </div>

        <div className="flex  gap-4 items-center">
          <h2 className="font-bold text-lg w-40">Order Status</h2>
          <div className="flex items-center gap-4">
            <CustomStatusDropdown value={status} onChange={setStatus} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderInfo;
