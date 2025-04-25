"use client";
import { getAllProduct, getProducts } from "@service/product";
import ProductCard from "@components/UI/ProductCard";
import { faEquals } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getAllCategory } from "@service/category";
import Link from "@node_modules/next/link";

export default function Home() {
  const PRODUCTS_LIMIT = 16;
  const [isLoading, setIsLoading] = useState(true);
  const bannerImage = [
    "https://cdn.thewirecutter.com/wp-content/media/2024/07/laptopstopicpage-2048px-3685-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp",
    "https://pianohouse.vn/image/cache/large/catalog/products/phu-kien-piano/Loa%20Marshall/marshall-banner-2.jpg",
    "https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4090/geforce-ada-4090-web-og-1200x630.jpg",
    "https://i.ytimg.com/vi/3hPoEmlBQdY/maxresdefault.jpg",
    "https://dlcdnwebimgs.asus.com/gain/9F8C42DB-36CE-4003-95E1-94E92594127F/fwebp",
  ];
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const firstBannerRef = useRef(null);
  const secondBannerRef = useRef(null);
  const fetchProducts = () => {
    setIsLoading(true);
    getAllProduct(40).then((data) => setProducts(data));
    setTimeout(() => setIsLoading(false), 1000);
  };

  const fetchCategories = () => {
    getAllCategory().then((data) => setCategories(data));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    const scrollInterval = setInterval(() => {
      // Scroll the first banner
      if (firstBannerRef.current) {
        const scrollWidth = firstBannerRef.current.scrollWidth;
        const clientWidth = firstBannerRef.current.clientWidth;

        // Check if scrolled to the end
        if (firstBannerRef.current.scrollLeft + clientWidth >= scrollWidth) {
          firstBannerRef.current.scrollLeft = 0;
        } else {
          firstBannerRef.current.scrollBy({
            left: clientWidth,
            behavior: "smooth",
          }); // Scroll to the right
        }
      }

      // Scroll the second banner
      if (secondBannerRef.current) {
        const scrollWidth = secondBannerRef.current.scrollWidth;
        const clientWidth = secondBannerRef.current.clientWidth;

        // Check if scrolled to the end
        if (secondBannerRef.current.scrollLeft + clientWidth >= scrollWidth) {
          secondBannerRef.current.scrollLeft = 0;
        } else {
          secondBannerRef.current.scrollBy({
            left: clientWidth,
            behavior: "smooth",
          }); // Scroll to the right
        }
      }
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(scrollInterval); // Cleanup on unmount
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* banner */}
      <div className="w-full overflow-hidden rounded-lg shadow-md relative">
        <ul
          ref={firstBannerRef}
          className="relative w-full flex flex-row items-center overflow-x-scroll no-scrollbar snap-mandatory snap-x gap-4 bg-secondary/50"
        >
          {bannerImage.map((image, index) => (
            <li
              key={index}
              className="min-w-full h-fit relative flex items-center justify-center "
            >
              {" "}
              {/* Specify height here */}
              <Image
                src={image}
                alt="product image"
                width={0} // Set the width of the image
                height={0}
                blurDataURL="data:/images/PLACEHOLDER.jpg"
                placeholder="blur"
                layout="responsive" // Set the height of the image for proper aspect ratio
                className="size-full object-contain snap-start" // Ensure the image covers the entire area
              />
            </li>
          ))}
        </ul>
        <Link href={"/search"}>
          <button className="button-variant-1 absolute right-10 bottom-10">
            Buy now
          </button>
        </Link>
      </div>

      {/* product categories */}
      <div className="flex gap-2 justify-center items-center">
        <ul className="px-4 py-2 min-h-[48px] flex-wrap items-center bg-surface text-on-surface gap-6 flex rounded-xl text-base sm:text-lg shadow-md">
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <li
                  key={index}
                  className="animate-pulse h-6 w-[100px] rounded-lg bg-primary"
                ></li>
              ))
            : categories.slice(0, 5).map((item) => (
                <li
                  key={item.category_id}
                  className="hover:font-bold cursor-pointer"
                >
                  <Link href={`/search?category=${item.category_id}`}>
                    {item.category_name}
                  </Link>
                </li>
              ))}
        </ul>
      </div>

      <p className="text-2xl font-semibold my-4">See our newest products</p>
      {/* product list */}
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 overflow-visible">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <ProductCard key={index} loading={true} />
            ))
          : products
              .slice(0, 8)
              .map((item) => (
                <ProductCard key={item.product_id} product={item} />
              ))}
      </ul>

      <ul className="flex flex-col gap-2 w-full">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <li key={index}>
                <p className="text-2xl font-semibold my-4">Products from ...</p>
                <ul className="w-full overflow-scroll no-scrollbar flex flex-row gap-2">
                  {Array.from({ length: 16 }).map((_, index) => (
                    <ProductCard key={index} loading={true} />
                  ))}
                </ul>
              </li>
            ))
          : categories?.slice(0, 4).map((item) => (
              <li key={item.category_id}>
                <p className="text-2xl font-semibold my-4">
                  Products from {item.category_name}
                </p>
                <ul className="w-full overflow-x-scroll no-scrollbar flex flex-row gap-2 shadow-inner">
                  {products
                    .filter(
                      (pd) => pd.categories[0]?.category_id === item.category_id
                    )
                    .map((pd) => (
                      <ProductCard key={pd.product_id} product={pd} />
                    ))}
                </ul>
              </li>
            ))}
      </ul>

      {/* banner */}
      <div className="w-full overflow-hidden rounded-lg shadow-md relative">
        <ul
          ref={secondBannerRef}
          className="relative w-full flex flex-row items-center overflow-x-scroll no-scrollbar snap-mandatory snap-x gap-4 bg-secondary/50"
        >
          {bannerImage.map((image, index) => (
            <li
              key={index}
              className="min-w-full h-fit relative flex items-center justify-center "
            >
              {" "}
              {/* Specify height here */}
              <Image
                src={image}
                alt="product image"
                width={800}
                height={800}
                className="size-full object-contain snap-start" // Ensure the image covers the entire area
                priority
              />
            </li>
          ))}
        </ul>
        <Link href={"/search"}>
          <button className="button-variant-1 absolute right-10 bottom-10">
            Buy now
          </button>
        </Link>
      </div>
    </div>
  );
}
