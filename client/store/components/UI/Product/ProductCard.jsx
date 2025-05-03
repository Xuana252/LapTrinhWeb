import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { formattedDate, formattedPrice } from "@util/format";

const ProductCard = ({ product, loading = false }) => {
  if (loading)
    return (
      <div className="flex flex-row relative min-w-[150px] gap-2 shadow-lg p-2 rounded-lg bg-primary/70 text-on-primary">
        {/* Image skeleton */}
        <div className="size-[80px] animate-pulse   bg-surface rounded-md"></div>

        {/* Main text area */}
        <div className="flex flex-col justify-around grow gap-2">
          <div className="animate-pulse h-5 w-32 bg-surface rounded" />
          <div className="animate-pulse h-4 w-24 bg-surface rounded" />
        </div>

        {/* Right side info */}
        <div className="flex flex-col justify-between items-end gap-2">
          <div className="animate-pulse h-4 w-20 bg-surface rounded" />
          <div className="flex items-center gap-1">
            <div className="animate-pulse h-4 w-6 bg-surface rounded" />
          </div>
          <div className="animate-pulse h-5 w-16 bg-surface rounded" />
          <div className="animate-pulse h-4 w-14 bg-surface rounded opacity-50" />
        </div>

      </div>
    );
  if (!product) return null;
  return (
    <Link
      href={`/product/products/${product._id}`}
      className="flex flex-row relative min-w-[150px] gap-2 shadow-lg p-2 rounded-lg bg-primary/70 text-on-primary hover:bg-primary cursor-pointer transition-all duration-100 ease-in-out"
    >
      <div className="relative  size-[80px] flex justify-center ">
        <Image
          src={
            product.image[0]
              ? product.image[0]
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

      <div className="flex flex-col justify-around grow">
        <div className=" whitespace-pre-line text-sm">
          {product.product_name}
        </div>
        <h3 className="opacity-70 text-sm">{product.category.category_name}</h3>
      </div>
      <div className="flex flex-col justify-between items-end">
        <div className="text-sm italic opacity-70">
          {formattedDate(product.createdAt)}
        </div>
        <div className="flex justify-between items-center">
          <div className="text-yellow-400 flex flex-row items-center gap-1">
            <span className="font-semibold">
              {product.average_rating.toFixed(1)}
            </span>
            <FontAwesomeIcon icon={faStar} />
          </div>
        </div>
        <div className="text-lg font-semibold text-green-600">
          {formattedPrice(
            product.price -
              (product.price / 100) *
                (product.discount + product.category.discount)
          )}
        </div>
        {(product.discount > 0 || product.category.discount > 0) && (
          <span className="opacity-50 text-sm font-semibold">
            {formattedPrice(product.price)}
          </span>
        )}
      </div>
      <div className="flex flex-row gap-1 absolute -top-1 left-2 text-sm">
        {product.discount > 0 && (
          <span className="rounded px-1 text-white bg-red-500 font-semibold">
            -{product.discount}%
          </span>
        )}
        {product.category.discount > 0 && (
          <span className="rounded px-1 text-white bg-green-500 font-semibold">
            -{product.category.discount}%
          </span>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
