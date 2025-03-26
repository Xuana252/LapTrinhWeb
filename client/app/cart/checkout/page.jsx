"use client";
import {
  fetchDistricts,
  fetchProvinces,
  fetchWards,
  getCustomerAddresses,
} from "@service/address";
import CheckBox from "@components/Input/CheckBox";
import DropDownButton from "@components/Input/DropDownButton";
import InputBox from "@components/Input/InputBox";
import PhoneInput from "@components/Input/PhoneInput";
import RadioButton from "@components/Input/RadioButton";
import CartItem from "@components/UI/CartItem";
import Divider from "@components/UI/Divider";
import OrderItem from "@components/UI/OrderItem";
import { faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faLocation,
  faLocationDot,
  faMap,
  faTrash,
  faMoneyBill,
  faCashRegister,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useReducer, useState, useEffect, useContext } from "react";
import CollapsibleContainer from "@components/UI/CollapsibleBanner";
import { formattedPrice } from "@util/format";
import { toastWarning } from "@util/toaster";
import {
  useDispatch,
  useSelector,
} from "@node_modules/react-redux/dist/react-redux";
import {
  setOrderAddress,
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

const Checkout = () => {
  const session = useSelector((state) => state.session);
  const order = useSelector((state) => state.order);
  const router = useRouter();

  const [provinces, setProvinces] = useState();
  const [districts, setDistricts] = useState();
  const [wards, setWards] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const [userAddresses, setUserAddresses] = useState([]);

  const [selectedOption, setSelectedOption] = useState(0);

  const reduxDispatch = useDispatch();

  const [receipt, dispatch] = useReducer(reducer, {
    subtotal: order?.order_items.reduce(
      (acc, item) => acc + item.total_price,
      0
    ),
    discount: 0,
    total: 0,
  });

  const [province, setProvince] = useState();
  const [district, setDistrict] = useState();
  const [ward, setWard] = useState();

  const [address, setAddress] = useState({
    address_id:"0",
    full_name: "",
    phone_number: "",
    address: "",
    city: "",
    district: "",
    ward: "",
  });

  const fetchAddress = () => {
    setIsLoading(true);

    getCustomerAddresses(session.customer?.customer_id).then((data) => {
      setSelectedOption(data.findIndex((item) => item.is_primary) + 1);
      setUserAddresses(data.map((a, index) => ({ id: index, ...a })));
    });

    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleRadioSelectionChange = (value) => {
    setSelectedOption(value);
  };

  useEffect(() => {
    setAddress((a) => ({ ...a, city: province?.name ||"" }));
    setDistrict(null);
    getDistricts(province?.id || "");
  }, [province]);

  useEffect(() => {
    setAddress((a) => ({ ...a, district: district?.name ||"" }));
    setWard(null);
    getWards(district?.id || "");
  }, [district]);

  useEffect(() => {
    setAddress((a) => ({ ...a, ward: ward?.name ||"" }));
  }, [ward]);

  const getProvinces = async () => {
    const provinces = await fetchProvinces();

    setProvinces(
      provinces.map((item) => {
        return { id: item.province_id, name: item.province_name };
      })
    );
  };

  const getDistricts = async (id) => {
    const districts = await fetchDistricts(id);

    setDistricts(
      districts.map((item) => {
        return { id: item.district_id, name: item.district_name };
      })
    );
  };

  const getWards = async (id) => {
    const wards = await fetchWards(id);

    setWards(
      wards.map((item) => {
        return { id: item.ward_id, name: item.ward_name };
      })
    );
  };

  useEffect(() => {
    getProvinces();
  }, []);

  useEffect(()=> {
    fetchAddress();
  },[session])

  useEffect(() => {
    const total = receipt.subtotal - receipt.discount;
    dispatch({ type: "change_total", payload: total < 0 ? 0 : total });
  }, [receipt.subtotal, receipt.discount]);

  const handlePayment = async () => {
    const checkoutAddress =
      selectedOption === 0 ? address : userAddresses[selectedOption - 1];
    if (selectedOption === 0) {
      for (let key in address) {
        if (address[key].trim() === "") {
          toastWarning("Please fill all the field");
          return;
        }
      }
    }

    // Dispatch the shipping address to Redux
    reduxDispatch(
      setOrderAddress({
        address: {  
            address_id: checkoutAddress.address_id,
            full_name: checkoutAddress.full_name,
            phone_number: checkoutAddress.phone_number,
            address: checkoutAddress.address,
            city:  checkoutAddress.city,
            district: checkoutAddress.district,
            ward: checkoutAddress.ward,
        },
      })
    );
    await reduxDispatch(setOrderStateAsync(2));
    router.push("/cart/checkout/payment");
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
          <h3 className="font-bold text-2xl">
            <Link href={"/cart/checkout"}>Checkout</Link>
          </h3>
          <span className="size-2 sm:size-3 bg-on-background rounded-full opacity-50"></span>
          <h3 className="text-xl opacity-50">
            <Link href={"/cart/checkout/payment"}>Payment</Link>
          </h3>
        </ul>
        {/* Cart items list */}
        <div className="panel-1 ">
          <h3 className="text-xl mb-2">
            Select Shipping address <FontAwesomeIcon icon={faLocationDot} />
          </h3>
          <Divider />
          <div className="flex flex-col py-4 gap-4">
            <div className="flex flex-row gap-1 size-fit items-center">
              <RadioButton
                name={"shipping address"}
                value={0}
                checked={selectedOption === 0}
                onChange={handleRadioSelectionChange}
              />
              <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <InputBox
              value={address.full_name}
              name={"Full name *"}
              onChange={(s) => setAddress((a) => ({ ...a, full_name: s }))}
            />
            <PhoneInput
              value={address.phone_number}
              name={"Phone number *"}
              onChange={(s) => setAddress((a) => ({ ...a, phone_number: s }))}
            />
            <div className="flex gap-4 flex-wrap  items-center h-fit rounded-xl w-full z-50">
              <DropDownButton
                value={province}
                options={provinces}
                name="province"
                onChange={setProvince}
                zIndex={70}
              />
              <DropDownButton
                value={district}
                options={districts}
                name="district"
                onChange={setDistrict}
                zIndex={60}
              />
              <DropDownButton
                value={ward}
                options={wards}
                name="ward"
                onChange={setWard}
                zIndex={50}
              />
            </div>
            <InputBox
              value={address.address}
              name={"Specific address *"}
              onChange={(s) => setAddress((a) => ({ ...a, address: s }))}
            />
          </div>

          <h3 className="text-xl">Or choose a preset address</h3>
          <Divider />
          <ul className="flex flex-col gap-2 py-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <label
                    key={index}
                    className="grid grid-cols-[auto_1fr] gap-3 items-center w-full bg-surface rounded-lg p-2 min-h-[70px]"
                    htmlFor={index + 1}
                  >
                    <div className="flex flex-row gap-1 size-fit items-center">
                      <RadioButton
                        name={"shipping address"}
                        value={index + 1}
                        checked={false}
                        onChange={() => {}}
                      />
                      <FontAwesomeIcon icon={faLocationDot} />
                    </div>
                    <div className="flex flex-col items-start justify-around text-xs gap-2">
                      <div className="flex flex-wrap gap-2">
                        <div className="h-4 rounded-lg bg-primary animate-pulse w-[70px]"></div>
                        <div className="h-4 rounded-lg bg-primary animate-pulse w-[70px]"></div>
                      </div>
                      <div className="opacity-50 h-4 rounded-lg bg-primary animate-pulse w-[120px]"></div>
                      <div className="opacity-50 h-4 rounded-lg bg-primary animate-pulse w-full max-w-[300px]"></div>
                    </div>
                  </label>
                ))
              : userAddresses.map((item, index) => (
                  <label
                    key={index}
                    className="grid grid-cols-[auto_1fr] gap-3 items-center w-full bg-surface rounded-lg p-2 min-h-[70px]"
                    htmlFor={index + 1}
                  >
                    <div className="flex flex-row gap-1 size-fit items-center">
                      <RadioButton
                        name={"shipping address"}
                        value={index + 1}
                        checked={selectedOption === index + 1}
                        onChange={handleRadioSelectionChange}
                      />
                      <FontAwesomeIcon icon={faLocationDot} />
                    </div>
                    <div className="flex flex-col items-start justify-around text-xs">
                      <h4>
                        {item.full_name} | {item.phone_number}
                      </h4>
                      <h3 className="opacity-50">{item.address}</h3>
                      <h3 className="opacity-50">
                        {[item.ward, item.district, item.city].join(", ")}
                      </h3>
                    </div>
                  </label>
                ))}
          </ul>
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

          <div className="flex flex-row justify-between items-center gap-4">
            <h3 className="opacity-70">Subtotal</h3>
            <span className="">{formattedPrice(receipt.subtotal)}</span>
          </div>
          <div className="flex flex-row justify-between items-center gap-4">
            <h3 className="opacity-70">Discount</h3>
            <span>{formattedPrice(receipt.discount)}</span>
          </div>

          <Divider />

          <div className="flex flex-row justify-between items-center gap-4">
            <h3>Grand total</h3>
            <span className="font-bold text-lg">
              {formattedPrice(receipt.total)}
            </span>
          </div>

          <button className="button-variant-1 w-full" onClick={handlePayment}>
            Continue to payment
          </button>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
