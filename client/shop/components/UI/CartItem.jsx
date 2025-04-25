"use client";
import CheckBox from "@components/Input/CheckBox";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formattedPrice } from "@util/format";
import Image from "next/image";
import React, { useState, useEffect, useReducer } from "react";

function reducer(state, action) {
  if (action.type === "incremented_quantity") {
    return { quantity: state.quantity + 1 };
  } else if (action.type === "decremented_quantity" && state.quantity > 1) {
    return { quantity: state.quantity - 1 };
  } else if (action.type === "change_quantity") {
    return { quantity: action.payload };
  }
  return state;
}

const CartItem = ({ reCalculate, cartItem, removeItem }) => {
  const [isChecked, setIsChecked] = useState(cartItem.checked);
  const [state, dispatch] = useReducer(reducer, {
    quantity: cartItem.quantity,
  });

  useEffect(() => {
    reCalculate(cartItem.product_id, state.quantity, isChecked);
  }, [state.quantity, isChecked]);

  useEffect(() => {
    setIsChecked(cartItem.checked);
  }, [cartItem.checked]);

  const handleRemoveItem = () => {
    removeItem(cartItem.product_id);
  };

  const handleChangeQuantity = (e) => {
    const value = parseInt(e.target.value, 10) || 1; // default to 1 if input is invalid
    dispatch({ type: "change_quantity", payload: value });
  };

  return (
    <div className="grid grid-cols-[auto_1fr_1fr] sm:grid-cols-[auto_1fr_auto_20%] items-center gap-2 pb-2 last:border-none h-fit border-b-2 ">
      <CheckBox
        onChecked={() => setIsChecked(true)}
        onUnchecked={() => {
          setIsChecked(false);
        }}
        checked={cartItem.checked}
      />

      <div className="flex flex-row gap-2 items-center">
        <div className="min-w-[50px] max-w-[50px] md:min-w-[100px] md:max-w-[100px]  scale-95 md:scale-[1] transition-transform duration-200 aspect-square">
          <Image
            src={
              cartItem?.product.images[0]
                ? cartItem.product.images[0]
                : process.env.NEXT_PUBLIC_APP_LOGO
            }
            alt="product image"
            width={300}
            height={300}
            blurDataURL="data:/images/PLACEHOLDER.jpg"
            placeholder="blur"
            className="size-full object-contain"
          />
        </div>
        <div className="flex flex-col justify-around items-start">
          <h1 className="text-sm">{cartItem.product.product_name}</h1>
          <div className="sm:hidden flex-col gap-2 items-end justify-center flex">
            <div className="bg-secondary/40 border-2 border-on-surface rounded-xl  w-fit text-on-surface grid grid-cols-3 ">
              <button
                className="size-5 text-sm flex items-center justify-center hover:scale-105 active:scale-95"
                onClick={() => dispatch({ type: "decremented_quantity" })}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <input
                type="number"
                value={state.quantity}
                onChange={handleChangeQuantity}
                style={{
                  appearance: "textfield",
                  MozAppearance: "textfield",
                  WebkitAppearance: "none",
                }}
                min={1}
                className="size-5 text-base flex items-center justify-center bg-transparent outline-none text-center"
              ></input>
              <button
                className="size-5 text-sm flex items-center justify-center hover:scale-105 active:scale-95"
                onClick={() => dispatch({ type: "incremented_quantity" })}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="sm:flex flex-col gap-2 items-center justify-center hidden">
        <div className="bg-secondary/40 border-2 border-on-surface rounded-xl  w-fit text-on-surface grid grid-cols-3 ml-auto">
          <button
            className="size-7 text-base flex items-center justify-center hover:scale-105 active:scale-95"
            onClick={() => dispatch({ type: "decremented_quantity" })}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <input
            type="number"
            value={state.quantity}
            style={{
              appearance: "textfield",
              MozAppearance: "textfield",
              WebkitAppearance: "none",
            }}
            min={1}
            onChange={handleChangeQuantity}
            className="size-7 text-base flex items-center justify-center bg-transparent outline-none text-center"
          ></input>
          <button
            className="size-7 text-xl flex items-center justify-center hover:scale-105 active:scale-95"
            onClick={() => dispatch({ type: "incremented_quantity" })}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        <button
          className="flex flex-row items-center justify-center gap-2 underline text-sm md:text-base"
          onClick={handleRemoveItem}
        >
          <FontAwesomeIcon icon={faTrash} />
          Remove
        </button>
      </div>
      <div className="flex flex-col items-end sm:justify-center justify-between">
        <div className="text-xs text-right font-semibold">
          <div className="opacity-70">
            {formattedPrice(cartItem.product.price)}{" "}
            <span className="font-bold text-red-500">
              -{cartItem.product.discount}%
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold">
            {formattedPrice(
              cartItem.product.price -
                (cartItem.product.price / 100) * cartItem.product.discount
            )}
          </div>
        </div>
        <button
          className="flex sm:hidden flex-row items-center justify-center gap-2 underline text-sm md:text-base mt-auto"
          onClick={handleRemoveItem}
        >
          <FontAwesomeIcon icon={faTrash} />
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
