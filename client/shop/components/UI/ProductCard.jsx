import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { formattedPrice } from "@util/format";

const ProductCard = ({ product, loading = false }) => {
  if (loading)
    return (
      <div className="size-full h-[348px] max-h-[348px] min-w-[150px] shadow-lg p-2 rounded-lg bg-primary hover:shadow-on-background/50 hover:shadow-2xl cursor-pointers">
        <div className="animate-pulse flex flex-col gap-2">
          <div className="text-lg font-semibold break-all w-full h-7 bg-surface rounded-lg"></div>
          <div className="grow w-full h-[200px] bg-surface rounded-lg"></div>
          <div className="text-lg w-full h-7 bg-surface rounded-lg"></div>
          <div className="text-sm font-semibold w-full h-5 bg-surface rounded-lg"></div>
          <div className="flex justify-between items-center gap-2">
            <div className="text-yellow-400 flex flex-row items-baseline gap-1">
              <span className="font-semibold w-full"></span>
              <FontAwesomeIcon icon={faStar} />
            </div>
            <h3 className="opacity-70 text-sm w-full h-5 bg-surface rounded-lg"></h3>
          </div>
        </div>
      </div>
    );
  if (!product) return null;
  return (
    <Link
      href={`/product/${product.product_id}`}
      className="flex flex-col w-full min-w-[150px] gap-2 shadow-lg p-2 rounded-lg bg-primary text-on-primary hover:shadow-on-background/50 hover:shadow-2xl cursor-pointer"
    >
      <div className="text-lg font-semibold break-all ">
        {product.product_name}
      </div>
      <div className="grow flex items-center justify-center">
        <div className="relative w-full h-[200px] flex justify-center ">
          <Image
            src={
              product.images[0]
                ? product.images[0]
                : process.env.NEXT_PUBLIC_APP_LOGO
            }
            alt="product image"
            width={300}
            height={300}
            quality={75}
            blurDataURL="data:/images/PLACEHOLDER.jpg"
            placeholder="blur"
            className="h-full object-contain w-full"
            priority
          />
        </div>
      </div>
      <div className="text-lg font-semibold text-green-600">
        {formattedPrice(
          product.price - (product.price / 100) * product.discount
        )}
      </div>
      <div className="text-sm font-semibold">
        <span className="opacity-50 ">{formattedPrice(product.price)}</span>{" "}
        <span className="text-red-500 font-semibold">-{product.discount}%</span>{" "}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-yellow-400 flex flex-row items-center gap-1">
          <span className="font-semibold">
            {product.average_rating.toFixed(1)}
          </span>
          <FontAwesomeIcon icon={faStar} />
        </div>
        <h3 className="opacity-70 text-sm">
          {product.categories[0]?.category_name}
        </h3>
      </div>
    </Link>
  );
};

export default ProductCard;
