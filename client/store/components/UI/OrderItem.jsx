import Link from "@node_modules/next/link";
import { formattedPrice } from "@util/format";
import Image from "next/image";
import React from "react";

const OrderItem = ({ orderItem, loading }) => {
  if (loading)
    return (
      <div className="w-full max-h-[90px]  bg-surface text-on-surface rounded-xl grid grid-cols-[auto_1fr_auto] gap-2 p-2">
        <div className="size-full aspect-square bg-primary animate-pulse rounded-lg"></div>

        <div className="flex flex-col justify-between items-start">
          <div className=" h-6 md:h-7 bg-primary animate-pulse w-[100px] rounded-lg"></div>
          <div className="h-5 md:h-7 bg-primary animate-pulse w-[50px] rounded-lg"></div>
        </div>

        <div className="flex flex-col justify-between items-end gap-2">
          <div className="font-semibold h-5 w-full max-w-[100px] bg-primary animate-pulse  rounded-lg"></div>
          <div className="  h-3 w-[50px] bg-primary animate-pulse rounded-lg"></div>
          <div className="font-semibold h-5 w-full max-w-[150px] bg-primary animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  return (
    <Link
      href={`/product/${orderItem?.product_id._id}`}
      className="grid grid-cols-[auto_1fr_auto] gap-2 bg-surface text-on-surface p-2 rounded-xl overflow-x-scroll no-scrollbar shadow-md"
    >
      <div className="size-[50px] scale-[0.8] md:scale-100 transition-transform duration-200 aspect-square flex items-center h-full">
        <Image
          src={
            orderItem?.product_id.image[0]
              ? orderItem.product_id.image[0]
              : process.env.NEXT_PUBLIC_APP_LOGO
          }
          alt="product image"
          width={300}
          height={300}
          blurDataURL="data:/images/PLACEHOLDER.jpg"
          placeholder="blur"
          className="size-full object-scale-down"
        />
      </div>

      <div className="flex flex-col justify-between items-start">
        <h1 className=" text-sm md:text-lg">
          {orderItem?.product_id.product_name}
        </h1>
        <h2 className="text-sm md:text-lg">x{orderItem?.quantity}</h2>
      </div>

      <div className="flex flex-col justify-between items-end">
        {(orderItem?.product_id.discount > 0 ||
          orderItem?.product_id.category.discount > 0) && (
          <>
            <h2 className="font-semibold text-sm opacity-70">
              {formattedPrice(orderItem?.product_id.price)}
            </h2>
            <div className="flex flex-row gap-1">
              {orderItem?.product_id.discount > 0 && (
                <h2 className="bg-red-500 text-white font-semibold text-xs rounded px-1">
                  -{orderItem?.product_id.discount}%
                </h2>
              )}
              {orderItem?.product_id.category.discount > 0 && (
                <h2 className="bg-green-500 text-white font-semibold text-xs rounded px-1">
                  -{orderItem?.product_id.category.discount}%
                </h2>
              )}
            </div>
          </>
        )}
        <h2 className="font-semibold">{formattedPrice(orderItem?.price)}</h2>
      </div>
    </Link>
  );
};

export default OrderItem;
