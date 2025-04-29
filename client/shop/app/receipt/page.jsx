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

const Payment = () => {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const orderId_Zalo = params.get("apptransid")
  const router = useRouter();
  const session = useSelector((state) => state.session);
  const order = useSelector((state) => state.order);
  const reduxDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [receipt, setReceipt] = useState({
    subtotal: 0,
    discount: 0,
    total: 0,
  });

  if (!orderId&&!orderId_Zalo) router.replace("/");

  const checkPaymentStatus = () => {
    if ((!orderId &&!orderId_Zalo ) || !session.customer?.customer_id) return;

    // getOrder(session.customer?.customer_id, orderId?orderId:orderId_Zalo).then((data) => {
    //   setIsSuccessful(
    //     ((data.payment_method === "MOMO"|| data.payment_method === "ZALOPAY") && data.payment_status === "PAID") ||
    //       data.payment_method === "COD"
    //   );
    //   setIsLoading(false);
    // });
    setIsSuccessful(true)
    setIsLoading(false)
  };

  useEffect(() => {
    checkPaymentStatus();
    const subtotal =
      order?.order_items?.reduce((acc, item) => acc + item.total_price, 0) || 0;
    const discount = order?.order_voucher?.discount_amount || 0;
    const total = subtotal - (discount / 100) * subtotal;
    setReceipt({
      subtotal,
      discount,
      total,
    });
  }, [session]);

  const renderPaymentMethod = (method) => {
    switch (method) {
      case "COD":
        return (
          <h4 className="opacity-70 text-xl font-bold flex flex-row gap-2 items-center">
            <FontAwesomeIcon icon={faMoneyBill} />
            {order.order_payment_method}
          </h4>
        );
      case "MOMO":
        return (
          <h4 className="opacity-70 text-xl font-bold flex flex-row gap-2 items-center">
            <FontAwesomeIcon icon={faWallet} />
            {order.order_payment_method}{" "}
            <div className="size-9">
              <Image
                src={"/images/MoMo_Logo.png"}
                alt="MOMO"
                width={100}
                height={100}
              />
            </div>
          </h4>
        );
        case "ZALOPAY":
        return (
          <h4 className="opacity-70 text-xl font-bold flex flex-row gap-2 items-center">
            {order.order_payment_method}{" "}
            <div className="size-9 overflow-hidden rounded-md">
              <Image
                src={"/images/ZaloPay_Logo.png"}
                alt="MOMO"
                width={100}
                height={100}
              />
            </div>
            <FontAwesomeIcon icon={faWallet} />
          </h4>
        );
    }
  };

  const handleContinueShopping = async () => {
    setIsLoading(true)
    await reduxDispatch(setOrderStateAsync(0));
    reduxDispatch(clearOrder());
    setTimeout(()=>{router.push("/")},1000);
  };


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
        {isSuccessful ? (
          <>
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="text-6xl  transition-transform duration-200 scale-90 sm:scale-100 md:scale-110 my-4 text-green-500"
            />
            <h3 className="text-lg sm:text-xl md:text-3xl text-center text-green-500">
              Thanks for your order!
            </h3>
          </>
        ) : (
          <>
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="text-6xl  transition-transform duration-200 scale-90 sm:scale-100 md:scale-110 my-4 text-red-500"
            />
            <h3 className="text-lg sm:text-xl md:text-3xl text-center text-red-500">
              Unable to create order
            </h3>
          </>
        )}
        <h3 className="font-bold md:text-xl">Transaction date</h3>
        <h4 className="opacity-70">{formattedFullDate(new Date())}</h4>
        <Divider />
        <h3 className="font-bold md:text-xl">Shipping address</h3>
        <div className="flex flex-col items-start h-fit justify-around md:text-lg">
          <h4>
            {order?.order_address.full_name} |{" "}
            {order?.order_address.phone_number}
          </h4>
          <h3 className="opacity-50">
            {order?.order_address.address +
              ", " +
              order?.order_address.ward +
              ", " +
              order?.order_address.district +
              ", " +
              order?.order_address.city}
          </h3>
        </div>
        <Divider />
        <div className="flex flex-wrap items-center gap-2  justify-between">
          <h3 className="font-bold md:text-xl">Payment method</h3>
          {renderPaymentMethod(order.order_payment_method)}
        </div>
        <Divider />

        <h3 className="font-bold md:text-xl">Your order</h3>
        <CollapsibleContainer
          content={
            <ul className="flex flex-col gap-4">
              {order.order_items?.map((item) => (
                <OrderItem key={item.product_id} orderItem={item} />
              ))}
            </ul>
          }
          maxHeight={300}
        />

        <Divider />
        <h3 className="font-bold md:text-xl">Voucher</h3>

        {order.order_voucher != null && (
          <div className="relative h-[80px]  flex flex-row items-center cursor-pointer voucher">
            <div className="flex items-center justify-center h-full aspect-square bg-on-primary grow max-w-[80px] text-primary text-3xl font-bold">
              {order.order_voucher?.discount_amount}%
            </div>
            <div className="p-2 flex flex-col  gap-[1px] ">
              <h3 className="text-base font-bold ">
                {order.order_voucher?.voucher_name}
              </h3>
              <h4 className="opacity-60 text-xs ">
                {order.order_voucher?.description}
              </h4>
              <div className="flex flex-row items-center gap-2 text-xs">
                <FontAwesomeIcon icon={faClock} />
                <h5>
                  {formattedDate(order.order_voucher?.valid_from)} to{" "}
                  {formattedDate(order.order_voucher?.valid_to)}
                </h5>
              </div>
            </div>
          </div>
        )}

        <Divider />

        <div className="flex flex-row justify-between items-center font-bold gap-4">
          <h3 className="opacity-70">Subtotal</h3>
          <span className="">{formattedPrice(receipt.subtotal)}</span>
        </div>
        <Divider />
        <div className="flex flex-row justify-between items-center gap-4">
          <h3 className="opacity-70">Discount</h3>
          <span>
            <span className="font-bold text-red-500">
              {" "}
              (-{receipt.discount}%){" "}
            </span>
            {formattedPrice((receipt.discount / 100) * receipt.subtotal)}
          </span>
        </div>
        <div className="flex flex-row justify-between items-center gap-4">
          <h3 className="opacity-70">Shipment cost</h3>
          <span>{formattedPrice(30000)}</span>
        </div>

        <Divider />

        <div className="flex flex-row justify-between items-center font-bold gap-4">
          <h3>Grand total</h3>
          <span className="font-bold text-lg">
            {formattedPrice(receipt.total - 30000)}
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
