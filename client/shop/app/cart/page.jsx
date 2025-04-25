"use client";
import CheckBox from "@components/Input/CheckBox";
import CartItem from "@components/UI/CartItem";
import Divider from "@components/UI/Divider";
import { faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSession, useSession } from "@node_modules/next-auth/react";
import {
  deleteAllCartItem,
  deleteCartItem,
  updateCartItem,
} from "@service/cart";
import { formattedPrice } from "@util/format";
import { toastSuccess, toastWarning } from "@util/toaster";
import { useRouter } from "next/navigation";
import React, { useReducer, useState, useEffect, useContext } from "react";

import {
  useDispatch,
  useSelector,
} from "@node_modules/react-redux/dist/react-redux";
import {
  removeItem,
  remove,
  removeAllItem,
} from "@provider/redux/cart/cartSlice";
import {
  setOrderItems,
  setOrderState,
  setOrderStateAsync,
} from "@provider/redux/order/orderSlice";

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

const Cart = () => {
  const session = useSelector((state) => state.session);
  const cart = useSelector((state) => state.cart.items);
  const reduxDispatch = useDispatch();
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [receipt, dispatch] = useReducer(reducer, {
    subtotal: 0,
    discount: 0,
    total: 0,
  });

  const deleteItem = (id) => {
    deleteCartItem(session.customer.customer_id, id);
    reduxDispatch(
      removeItem({
        id: id,
      })
    );
  };
  useEffect(() => {
    session && setCartItems(cart.map((item) => ({ checked: false, ...item })));
  }, [session]);

  useEffect(() => {
    const newSubtotal = cartItems.reduce((acc, item) => {
      return item.checked
        ? acc +
            (item.product.price -
              (item.product.price / 100) * item.product.discount) *
              item.quantity
        : acc;
    }, 0);

    dispatch({ type: "change_subtotal", payload: newSubtotal });

  }, [cartItems]);

  useEffect(() => {
    const total = receipt.subtotal - receipt.discount;
    dispatch({ type: "change_total", payload: total < 0 ? 0 : total });
  }, [receipt.subtotal, receipt.discount]);

  const handleCheckout = async () => {
    if (cartItems.filter((item) => item.checked).length <= 0) {
      toastWarning("Please select at least one item before checking out");
      return;
    }
    const orderItems = cartItems
      .filter((item) => item.checked)
      .map((item) => ({
        order_id: "",
        product_id: item.product_id,
        product: item.product,
        quantity: item.quantity,
        unit_price:
          item.product.price -
          (item.product.price / 100) * item.product.discount,
        total_price:
          (item.product.price -
            (item.product.price / 100) * item.product.discount) *
          item.quantity,
      }));

    // Dispatching the order items to Redux
    reduxDispatch(setOrderItems({ items: orderItems }));
    await reduxDispatch(setOrderStateAsync(1));
    router.push("cart/checkout");
  };

  const handleRemoveItem = async (id) => {
    const newCart = cartItems.filter((item) => item.product_id !== id);
    deleteItem(id);
    setCartItems(newCart);
    toastSuccess("item deleted");
  };

  const handleRemoveAllItems = async () => {
    reduxDispatch(removeAllItem());
    deleteAllCartItem(session.customer.customer_id);
    setCartItems([]);
    toastSuccess("items deleted");
  };

  const setAllCheckState = (checked) => {
    const newCart = cartItems.map((item) => {
      return { ...item, checked };
    });

    setCartItems(newCart);
  };

  const handleCalculateSubtotal = (id, quantity, checked) => {
    const newCart = cartItems.map((item) => {
      if (item.product_id === id) {
        return { ...item, checked, quantity };
      }
      return item;
    });

    setCartItems(newCart);
  };

  return (
    <section className="size-full flex flex-col items-center gap-10 p-4">
      <div className="w-full grid grid-cols-1 md:grid-rows-[auto_1fr] md:grid-flow-col gap-4">
        {/* Cart header */}
        <div className="flex flex-row justify-between items-end">
          <h3 className="font-bold text-4xl">Cart</h3>
          <button
            className="button-variant-1 text-xs md:text-base"
            onClick={()=>handleRemoveAllItems()}
          >
            <FontAwesomeIcon icon={faTrash} />
            <span>Remove all</span>
          </button>
        </div>
        {/* Cart items list */}
        <div className="panel-1 ">
          <div className="w-full">
            <div className="grid grid-cols-[auto_1fr_1fr] sm:grid-cols-[auto_1fr_1fr_20%] items-center font-bold gap-2 text-on-surface">
              <CheckBox
                onChecked={() => setAllCheckState(true)}
                onUnchecked={() => setAllCheckState(false)}
              />
              <h3 className="text-left">
                Products (
                {cartItems.filter((item) => item.checked === true).length || 0}/
                {cartItems.length || 0})
              </h3>
              <h3 className="hidden sm:inline-block text-center ml-auto">
                Quantity
              </h3>
              <h3 className="text-right">Price</h3>
            </div>
            <Divider />
            <ul className="flex flex-col gap-4 py-4">
              {cartItems?.map((item) => (
                <CartItem
                  key={item.product_id}
                  reCalculate={handleCalculateSubtotal}
                  cartItem={item}
                  removeItem={handleRemoveItem}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* Total review */}
        <div className="panel-1 flex flex-col gap-10 text-base min-w-[250px] md:row-start-2">
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

          <button className="button-variant-1 w-full" onClick={handleCheckout}>
            {" "}
            Checkout now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cart;
