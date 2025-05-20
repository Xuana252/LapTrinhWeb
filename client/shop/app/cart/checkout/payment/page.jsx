"use client";
import { fetchDistricts, fetchProvinces, fetchWards } from "@service/address";
import CheckBox from "@components/Input/CheckBox";
import DatePicker from "@components/Input/DatePicker";
import DropDownButton from "@components/Input/DropDownButton";
import InputBox from "@components/Input/InputBox";
import PhoneInput from "@components/Input/PhoneInput";
import RadioButton from "@components/Input/RadioButton";
import CartItem from "@components/UI/CartItem";
import Divider from "@components/UI/Layout/Divider";
import OrderItem from "@components/UI/OrderItem";
import {
  faCheckSquare,
  faCreditCardAlt,
} from "@fortawesome/free-regular-svg-icons";
import {
  faCheck,
  faCheckCircle,
  faClock,
  faCoins,
  faCreditCard,
  faLocation,
  faLocationDot,
  faMap,
  faMoneyBills,
  faShoppingBag,
  faTrash,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useReducer, useState, useEffect, useContext } from "react";
import CollapsibleContainer from "@components/UI/CollapsibleBanner";
import { useSession } from "@node_modules/next-auth/react";
import { formattedDate, formattedPrice } from "@util/format";
import Image from "@node_modules/next/image";
import {
  useDispatch,
  useSelector,
} from "@node_modules/react-redux/dist/react-redux";
import {
  setOrderItems,
  setOrderPaymentMethod,
  setOrderState,
  setOrderStateAsync,
} from "@provider/redux/order/orderSlice";
import Link from "@node_modules/next/link";

function reducer(state, action) {
  if (action.type === "change_subtotal" && action.payload >= 0) {
    return { ...state, subtotal: action.payload };
  } else if (action.type === "change_discount" && action.payload >= 0) {
    return { ...state, discount: action.payload };
  } else if (action.type === "change_total" && action.payload >= 0) {
    return { ...state, total: action.payload };
  }
  return state;
}

const Payment = () => {
  const session = useSelector((state) => state.session);
  const order = useSelector((state) => state.order);
  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState("cod");

  const reduxDispatch = useDispatch();
  const [receipt, dispatch] = useReducer(reducer, {
    subtotal: order?.order_item.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    ),
    total: 0,
  });

  const handleRadioSelectionChange = (value) => {
    setSelectedOption(value);
  };

  useEffect(() => {
    const total = receipt.subtotal;

    // Ensure the total is not negative
    const finalTotal = total < 0 ? 0 : total;

    // Dispatch updated values to the reducer
    dispatch({ type: "change_total", payload: finalTotal });
  }, [receipt.subtotal]);

  const handleConfirm = async () => {
    // Dispatch the payment method action
    reduxDispatch(
      setOrderPaymentMethod({
        payment_method: selectedOption,
      })
    );
    await reduxDispatch(setOrderStateAsync(3));
    router.push("/cart/checkout/payment/confirm");
  };

  return (
    <section className="size-full flex flex-col items-center gap-10 p-4">
      <div className="w-full grid grid-cols-1 md:grid-rows-[auto_1fr] md:grid-flow-col gap-4">
        {/* Cart header */}
        <ul className="flex flex-row items-center gap-2">
          <h3 className="text-xl opacity-50">
            <Link href={"/cart"}>Cart</Link>
          </h3>
          <span className="size-2 sm:size-3 bg-on-background rounded-full opacity-50"></span>
          <h3 className="text-xl opacity-50">
            <Link href={"/cart/checkout"}>Checkout</Link>
          </h3>
          <span className="size-2 sm:size-3 bg-on-background rounded-full opacity-50"></span>
          <h3 className="font-bold text-2xl">
            <Link href={"/cart/checkout/payment"}>Payment</Link>
          </h3>
        </ul>
        {/* Cart items list */}
        <div className="panel-1 ">
          <h3 className="text-xl  mb-2">
            Select Payment method <FontAwesomeIcon icon={faCoins} />
          </h3>
          <Divider />

          <label
            className=" py-4 gap-4 rounded-xl bg-surface my-2 flex flex-row justify-between  h-fit items-center px-4"
            htmlFor="momo"
          >
            <div className="flex flex-row gap-4 items-center">
              <RadioButton
                name={"payment method"}
                value={"momo"}
                checked={selectedOption === "momo"}
                onChange={handleRadioSelectionChange}
              />

              <h3>E-wallet (MOMO)</h3>
              <div className="size-9 overflow-hidden rounded-md">
                <Image
                  src={"/images/MoMo_Logo.png"}
                  alt="MOMO"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <FontAwesomeIcon icon={faWallet} />
          </label>
          <label
            className=" py-4 gap-4 rounded-xl bg-surface my-2 flex flex-row justify-between  h-fit items-center px-4"
            htmlFor="zalopay"
          >
            <div className="flex flex-row gap-4 items-center">
              <RadioButton
                name={"payment method"}
                value={"zalopay"}
                checked={selectedOption === "zalopay"}
                onChange={handleRadioSelectionChange}
              />

              <h3>E-wallet (ZALOPAY)</h3>
              <div className="size-9 overflow-hidden rounded-md">
                <Image
                  src={"/images/ZaloPay_Logo.png"}
                  alt="ZALOPAY"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <FontAwesomeIcon icon={faWallet} />
          </label>
          <label
            className="py-4 gap-4 rounded-xl bg-surface my-2 flex flex-row justify-between h-fit items-center px-4"
            htmlFor="cod"
          >
            <div className="flex flex-row gap-4 items-center">
              <RadioButton
                name={"payment method"}
                value={"cod"}
                checked={selectedOption === "cod"}
                onChange={handleRadioSelectionChange}
              />
              <h3>Cash on Delivery</h3>
            </div>
            <FontAwesomeIcon icon={faMoneyBills} />
          </label>
        </div>

        {/* Total review */}
        <div className="panel-1 flex flex-col gap-4 text-base min-w-[250px] md:row-start-2">
          <h3>Your order</h3>
          <CollapsibleContainer
            content={
              <ul className="flex flex-col gap-4">
                {order?.order_item.map((item) => (
                  <OrderItem key={item.product_id._id} orderItem={item} />
                ))}
              </ul>
            }
            maxHeight={300}
          />

          <Divider />
          <h3 className="text-base md:text-xl">Shipping address</h3>
          <div className="flex flex-col items-start h-full justify-around text-sm">
            <h4>
              {order?.address?.name} | {order?.address?.phone_number}
            </h4>
            <h3 className="opacity-50">{order?.address?.detailed_address}</h3>
            <h3 className="opacity-50 whitespace-pre-line">
              {
                (order?.address.ward ?? "") +
                ", " +
                (order?.address.district ?? "") +
                ", " +
                (order?.address.province ?? "")}
            </h3>
          </div>

          <Divider />

          <div className="flex flex-row justify-between items-center gap-4">
            <h3 className="opacity-70">Subtotal</h3>
            <span className="">{formattedPrice(receipt.subtotal)}</span>
          </div>

          <div className="flex flex-row justify-between items-center gap-4">
            <h3 className="opacity-70">Shipment cost</h3>
            <span>{formattedPrice(30000)}</span>
          </div>
          <Divider />

          <div className="flex flex-row justify-between items-center gap-4">
            <h3>Grand total</h3>
            <span className="font-bold text-lg">
              {formattedPrice(receipt.total + 30000)}
            </span>
          </div>

          <button className="button-variant-1 w-full" onClick={handleConfirm}>
            Confirm order
          </button>
        </div>
      </div>
    </section>
  );
};

export default Payment;
