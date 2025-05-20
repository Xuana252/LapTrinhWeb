"use client";
import Divider from "@components/UI/Layout/Divider";
import OrderItem from "@components/UI/OrderItem";
import {
  faCheckSquare,
  faCircleCheck,
  faCircleXmark,
  faClock,
  faCreditCardAlt,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useReducer, useState, useEffect } from "react";
import {
  useDispatch,
  useSelector,
} from "@node_modules/react-redux/dist/react-redux";
import { formattedDate, formattedFullDate, formattedPrice } from "@util/format";
import CollapsibleContainer from "@components/UI/CollapsibleBanner";
import {
  clearOrder,
  setOrderState,
  setOrderStateAsync,
} from "@provider/redux/order/orderSlice";
import {
  faMoneyBill,
  faWallet,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import Image from "@node_modules/next/image";
import { getOrder, payWithMoMo } from "@service/order";
import { toastError, toastRequest, toastSuccess } from "@util/toaster";
import { renderPaymentMethod } from "@util/render";

const Payment = () => {
  const session = useSelector((state) => state.session);
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const reduxDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [receipt, setReceipt] = useState({
    subtotal: 0,
    total: 0,
  });

  const handleContinueShopping = async () => {
    setIsLoading(true);
    await reduxDispatch(setOrderStateAsync(0));
    reduxDispatch(clearOrder());
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  const fetchOrder = async () => {
    console.log(orderId)
    setIsLoading(true);
    getOrder(orderId).then((data) => {
      if (data) {
        console.log(data)
        setOrder(data.user_id._id === session?.customer._id ? data : null);
        const subtotal =
          data?.order_item?.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          ) || 0;

        const total = subtotal;
        setReceipt({
          subtotal,
          total,
        });
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center text-2xl font-bold h-full size-full panel-1">
        Processing...
      </div>
    );

  return (
    <section className="size-full flex flex-col items-center gap-10 p-4">
      {/* Total review */}
      <div className="panel-1 flex flex-col gap-4 text-base w-full ">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-6xl  transition-transform duration-200 scale-90 sm:scale-100 md:scale-110 my-4 text-green-500"
        />
        <h3 className="text-lg sm:text-xl md:text-3xl text-center text-green-500">
          Thanks for your order!
        </h3>

        <h3 className="font-bold md:text-xl">Transaction date</h3>
        <h4 className="opacity-70">{formattedFullDate(new Date())}</h4>
        <Divider />
        <h3 className="font-bold md:text-xl">Shipping address</h3>
        <div className="flex flex-col items-start h-fit justify-around md:text-lg">
          <h4>
            {order?.address.name} | {order?.address.phone_number}
          </h4>
          <h3 className="opacity-50 whitespace-pre-line">
            {(order?.address.detailed_address ?? "") +
              ", " +
              (order?.address.ward ?? "") +
              ", " +
              (order?.address.district ?? "") +
              ", " +
              (order?.address.province ?? "")}
          </h3>
        </div>
        <Divider />
        <div className="flex flex-wrap items-center gap-2  justify-between">
          <h3 className="font-bold md:text-xl">Payment method</h3>
          {renderPaymentMethod(order?.payment_method)}
        </div>
        <Divider />

        <h3 className="font-bold md:text-xl">Your order</h3>
        <CollapsibleContainer
          content={
            <ul className="flex flex-col gap-4">
              {order?.order_item?.map((item) => (
                <OrderItem key={item.product_id._id} orderItem={item} />
              ))}
            </ul>
          }
          maxHeight={300}
        />

        <Divider />

        <div className="flex flex-row justify-between items-center font-bold gap-4">
          <h3 className="opacity-70">Subtotal</h3>
          <span className="">{formattedPrice(receipt.subtotal)}</span>
        </div>
        <Divider />
        <div className="flex flex-row justify-between items-center gap-4">
          <h3 className="opacity-70">Shipment cost</h3>
          <span>{formattedPrice(30000)}</span>
        </div>

        <Divider />

        <div className="flex flex-row justify-between items-center font-bold gap-4">
          <h3>Grand total</h3>
          <span className="font-bold text-lg">
            {formattedPrice(receipt.total + 30000)}
          </span>
        </div>

        <button
          className="button-variant-1 w-full"
          onClick={handleContinueShopping}
        >
          Continue shopping
        </button>
      </div>
    </section>
  );
};

export default Payment;
