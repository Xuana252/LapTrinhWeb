"use client";
import CheckBox from "@components/Input/CheckBox";
import QuantityInput from "@components/Input/QuantityInput";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formattedPrice } from "@util/format";
import Image from "next/image";
import React, { useState, useEffect, useReducer } from "react";

const CartItem = ({ reCalculate, cartItem, removeItem }) => {
  const [isChecked, setIsChecked] = useState(cartItem.checked);
  const [quantity, setQuantity] = useState(cartItem.quantity);

  useEffect(() => {
    reCalculate(cartItem.product_id._id, quantity, isChecked);
  }, [quantity, isChecked]);

  useEffect(() => {
    setIsChecked(cartItem.checked);
  }, [cartItem.checked]);

  const handleRemoveItem = () => {
    removeItem(cartItem.product_id._id);
  };

  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-2 pb-2  h-fit bg-surface p-2 rounded">
      <CheckBox
        onChecked={() => setIsChecked(true)}
        onUnchecked={() => {
          setIsChecked(false);
        }}
        checked={cartItem.checked}
      />

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center ">
          <div className="min-w-[50px] max-w-[50px] md:min-w-[100px] md:max-w-[100px]  scale-95 md:scale-[1] transition-transform duration-200 aspect-square">
            <Image
              src={
                cartItem?.product_id.image[0]
                  ? cartItem.product_id.image[0]
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
          <div className="md:flex flex-col gap-2 items-center justify-center hidden">
            <QuantityInput
              min={1}
              max={9999}
              value={quantity}
              onChange={setQuantity}
            />
            <button
              className="flex flex-row items-center justify-center gap-2 underline text-sm md:text-base"
              onClick={handleRemoveItem}
            >
              <FontAwesomeIcon icon={faTrash} />
              Remove
            </button>
          </div>
          <div className="flex flex-col items-end sm:justify-center justify-between">
            <div className="text-xs text-right font-semibold flex flex-col items-end">
              {(cartItem?.product_id.discount > 0 ||
                cartItem?.product_id.category.discount > 0) && (
                <>
                  <h2 className="font-semibold text-sm opacity-70">
                    {formattedPrice(cartItem?.product_id.price)}
                  </h2>
                  <div className="flex flex-wrap justify-end gap-1">
                    {cartItem?.product_id.discount > 0 && (
                      <h2 className="bg-red-500 text-white font-semibold text-xs rounded px-1">
                        -{cartItem?.product_id.discount}%
                      </h2>
                    )}
                    {cartItem?.product_id.category.discount > 0 && (
                      <h2 className="bg-green-500 text-white font-semibold text-xs rounded px-1">
                        -{cartItem?.product_id?.category.discount}%
                      </h2>
                    )}
                  </div>
                </>
              )}
              <div className="text-base sm:text-lg font-bold">
                {formattedPrice(
                  cartItem.product_id.price -
                    (cartItem.product_id.price / 100) *
                     ( cartItem.product_id.discount + cartItem.product_id.category.discount)
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between md:hidden">
          <QuantityInput
            min={1}
            max={9999}
            value={quantity}
            onChange={setQuantity}
          />
          <button
            className="flex flex-row items-center justify-center gap-2 underline text-sm md:text-base"
            onClick={handleRemoveItem}
          >
            <FontAwesomeIcon icon={faTrash} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
