"use client";
import { fetchDistricts, fetchProvinces, fetchWards } from "@service/address";
import CheckBox from "@components/Input/CheckBox";
import DatePicker from "@components/Input/DatePicker";
import DropDownButton from "@components/Input/DropDownButton";
import InputBox from "@components/Input/InputBox";
import PhoneInput from "@components/Input/PhoneInput";
import RadioButton from "@components/Input/RadioButton";
import CartItem from "@components/UI/CartItem";
import Divider from "@components/UI/Divider";
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
import { getVouchers } from "@service/voucher";
import { useSession } from "@node_modules/next-auth/react";
import { formattedDate, formattedPrice } from "@util/format";
import Image from "@node_modules/next/image";
import { useDispatch, useSelector } from "@node_modules/react-redux/dist/react-redux";
import { setOrderItems, setOrderPaymentMethod, setOrderState, setOrderStateAsync, setOrderVoucher } from "@provider/redux/order/orderSlice";
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
  const paymentMethods = ["MOMO", "COD","ZALOPAY"];
  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState("COD");

  const [vouchers, setVouchers] = useState([]);
  const [isSelectingVoucher, setIsSelectingVoucher] = useState(false);
  const [voucher, setVoucher] = useState();

  const reduxDispatch = useDispatch()
  const [receipt, dispatch] = useReducer(reducer, {
    subtotal: order?.order_items.reduce(
      (acc, item) => acc + item.total_price,
      0
    ),
    discount: 0,
    total: 0,
  });

  const fetchVoucher = () => {
    getVouchers().then((data) => {
      const activeAndValidVouchers = data.filter(
        (voucher) =>
          voucher.is_active && new Date(voucher.valid_to) >= new Date()
      );

      setVouchers(activeAndValidVouchers);
    });
  };

  const handleRadioSelectionChange = (value) => {
    setSelectedOption(value);
  };

  useEffect(() => {
    fetchVoucher();
  }, []);


  useEffect(() => {
    // If no voucher is selected, reset the total and discount
    if (!voucher) {
      dispatch({ type: "change_total", payload: receipt.subtotal });
      dispatch({ type: "change_discount", payload: 0 });
      return;
    }
  
    // Apply percentage discount if voucher is selected
    const discountAmount = voucher.discount_amount;  // Assuming this is a percentage
    const total = receipt.subtotal - (receipt.subtotal * (discountAmount / 100));
  
    // Ensure the total is not negative
    const finalTotal = total < 0 ? 0 : total;
  
    // Dispatch updated values to the reducer
    dispatch({ type: "change_total", payload: finalTotal });
    dispatch({ type: "change_discount", payload: discountAmount });
  }, [voucher, receipt.subtotal]);
  
  

  const handleConfirm = async () => {
    reduxDispatch(
      setOrderVoucher({
        voucher: voucher,
      })
    );
  
    // Dispatch the payment method action
    reduxDispatch(
      setOrderPaymentMethod({
        payment_method: selectedOption
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
          <h3 className="text-xl opacity-50"><Link href={'/cart'}>Cart</Link></h3>
          <span className="size-2 sm:size-3 bg-on-background rounded-full opacity-50"></span>
          <h3 className="text-xl opacity-50"><Link href={'/cart/checkout'}>Checkout</Link></h3>
          <span className="size-2 sm:size-3 bg-on-background rounded-full opacity-50"></span>
          <h3 className="font-bold text-2xl"><Link href={'/cart/checkout/payment'}>Payment</Link></h3>
        </ul>
        {/* Cart items list */}
        <div className="panel-1 ">
          <h3 className="text-xl  mb-2">
            Select Payment method <FontAwesomeIcon icon={faCoins} />
          </h3>
          <Divider />

          <label
            className=" py-4 gap-4 rounded-xl bg-surface my-2 flex flex-row justify-between  h-fit items-center px-4"
            htmlFor="MOMO"
          >
            <div className="flex flex-row gap-4 items-center">
              <RadioButton
                name={"payment method"}
                value={"MOMO"}
                checked={selectedOption === "MOMO"}
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
            htmlFor="ZALOPAY"
          >
            <div className="flex flex-row gap-4 items-center">
              <RadioButton
                name={"payment method"}
                value={"ZALOPAY"}
                checked={selectedOption === "ZALOPAY"}
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
            htmlFor="COD"
          >
            <div className="flex flex-row gap-4 items-center">
              <RadioButton
                name={"payment method"}
                value={"COD"}
                checked={selectedOption === "COD"}
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
                {order?.order_items.map((item) => (
                  <OrderItem key={item.product_id} orderItem={item} />
                ))}
              </ul>
            }
            maxHeight={300}
          />

          <Divider />
          <h3 className="text-base md:text-xl">Shipping address</h3>
          <div className="flex flex-col items-start h-full justify-around text-sm">
            <h4>
              {order?.order_address?.full_name} |{" "}
              {order?.order_address?.phone_number}
            </h4>
            <h3 className="opacity-50">
              {order?.order_address?.address}
            </h3>
            <h3 className="opacity-50">
              {[
                order?.order_address?.ward,
                order?.order_address?.district,
                order?.order_address?.city,
              ].join(", ")}
            </h3>
          </div>
          <Divider />

          <h3 className="text-base md:text-xl">Discount</h3>
          <div className="flex flex-row gap-2 items-center justify-between">
            <InputBox
              name={"Vouchers"}
              value={voucher ? voucher.voucher_name : ""}
              onChange={() => {}}
            />
            <button
              className="button-variant-1"
              onClick={() => setIsSelectingVoucher((prev) => !prev)}
            >
              Select
            </button>
          </div>
          {isSelectingVoucher && (
            <div className="flex flex-col gap-4 overflow-y-scroll no-scrollbar p-2  max-h-[250px]">
              {vouchers.map((vc) => (
                <div
                  key={vc.voucher_code}
                  className="relative h-[80px] w-full flex flex-row  items-center cursor-pointer voucher "
                  onClick={() => setVoucher(v=>v?.voucher_code===vc.voucher_code?null:vc)}
                >
                  <div className=" relative flex items-center justify-center h-full aspect-square bg-on-primary grow max-w-[80px] text-primary text-3xl font-bold">
                    {vc.discount_amount}% {voucher?.voucher_code===vc.voucher_code&&<FontAwesomeIcon icon={faCheckCircle} className="text-lg absolute top-1 left-1"/>}
                  </div>
                  <div className="p-2 flex flex-col gap-[1px] ">
                    <h3 className="text-base font-bold">
                     {vc.voucher_name}
                    </h3>
                    <h4 className="opacity-60 text-xs ">
                      {vc.description}
                    </h4>
                    <div className="flex flex-row items-center gap-2 text-xs white">
                      <FontAwesomeIcon icon={faClock} />
                      <h5>
                        {formattedDate(vc.valid_from)} to{" "}
                        {formattedDate(vc.valid_to)}
                      </h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Divider />

          <div className="flex flex-row justify-between items-center gap-4">
            <h3 className="opacity-70">Subtotal</h3>
            <span className="">{formattedPrice(receipt.subtotal)}</span>
          </div>
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

          <div className="flex flex-row justify-between items-center gap-4">
            <h3>Grand total</h3>
            <span className="font-bold text-lg">
              {formattedPrice(receipt.total-30000)}
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
