"use client";
import { formattedPrice } from "@util/format";
import { getProductDetail, getAllProduct } from "@service/product";

import ProductCard from "@components/UI/Product/ProductCard";
import ReviewStar from "@components/UI/ReviewStar";

import {
  faCartShopping,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useRouter } from "@node_modules/next/navigation";

import React, { useEffect, useReducer, useRef, useState } from "react";

import Link from "@node_modules/next/link";

import { toastError, toastSuccess, toastWarning } from "@util/toaster";

import {
  useDispatch,
  useSelector,
} from "@node_modules/react-redux/dist/react-redux";
import { addItem } from "@provider/redux/cart/cartSlice";
import { addCartItem } from "@service/cart";
import {
  setOrderItems,
  setOrderStateAsync,
} from "@provider/redux/order/orderSlice";
import ProductRatingTab from "@components/UI/Product/ProductRatingTab";
import ProductDescriptionTab from "@components/UI/Product/ProductDescriptionTab";
import ProductSpecTab from "@components/UI/Product/ProductSpecTab";
import ProductImageTab from "@components/UI/Product/ProductImageTab";
import QuantityInput from "@components/Input/QuantityInput";

const Product = () => {
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!session.isAuthenticated) {
      toastError("You need to login to proceed");
      return;
    }

    addCartItem(session.customer._id, product._id, quantity).then((data) => {
      if (data) {
        dispatch(
          addItem({
            product: product,
            quantity: quantity,
          })
        );

        toastSuccess("Product added to cart");
      } else {
        toastError("Failed to add item to cart");
      }
    });
  };

  const handleBuyNow = async () => {
    if (!session.isAuthenticated) {
      toastError("You need to login to proceed");
      return;
    }

    const orderItems = [
      {
        product_id: product,
        quantity: quantity,
        price:
          product.price -
          (product.price / 100) *
            Math.max(product.discount + product.category.discount, 0),
      },
    ];

    // Dispatching the order items to Redux
    dispatch(setOrderItems({ item: orderItems }));
    await dispatch(setOrderStateAsync(1));
    router.push("/cart/checkout");
  };

  const fetchProducts = () => {
    getAllProduct().then((data) => setProducts(data));
  };

  const fetchProductDetails = (id) => {
    getProductDetail(id).then((data) => {
      setProduct(data);
    });
  };

  useEffect(() => {
    setIsLoading(true);
    fetchProducts();
    fetchProductDetails(params.id);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <section className="size-full flex flex-col items-center gap-4 p-4 overflow-visible">
      <ul className="flex flex-row items-center justify-start gap-2 w-full">
        <h3 className="text-xl opacity-50 hover:opacity-100">
          <Link href={`/search?category=${product?.category?._id}`}>
            {product?.category?.category_name}
          </Link>
        </h3>
        <span className="size-2 sm:size-3 bg-on-background rounded-full opacity-50"></span>
        <h3 className="text-xl">{product?.product_name}</h3>
      </ul>
      <div className="panel-2 w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-10">
          <ProductImageTab images={product?.image} />
          <div className="flex flex-col gap-4 md:p-8 sm:panel-1 ">
            <h3 className="font-bold text-xl md:text-3xl">
              {product?.product_name}
            </h3>
            <div className="flex flex-row gap-1 items-center text-yellow-400">
              <ReviewStar rating={product?.average_rating} />
              {product?.feedback_count} reviews
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-green-600">
              {formattedPrice(
                product?.price -
                  (product?.price / 100) *
                    Math.min(
                      product?.discount + product?.category.discount,
                      100
                    )
              )}
            </div>
            {(product?.discount > 0 || product?.category.discount > 0) && (
              <div className=" font-semibold flex flex-wrap gap-1 items-center justify-start">
                <span className="opacity-50 ">
                  {formattedPrice(product.price)}
                </span>{" "}
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
            )}
            {product?.stock_quantity === 0 ? (
              <span className="text-red-500 text-base">
                currently out of stock
              </span>
            ) : (
              <>
                <div>{product?.stock_quantity} in-stocks</div>
                <QuantityInput
                  onChange={setQuantity}
                  max={product?.stock_quantity}
                  value={quantity}
                />
              </>
            )}

            <div className="flex flex-row gap-4">
              <button
                className={`button-variant-1 disabled:opacity-20`}
                onClick={handleAddToCart}
                disabled={product?.stock_quantity === 0}
              >
                Add to cart <FontAwesomeIcon icon={faCartShopping} />
              </button>
              <button
                className="button-variant-1 disabled:opacity-20"
                onClick={handleBuyNow}
                disabled={product?.stock_quantity === 0}
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] w-full">
        <ProductDescriptionTab description={product?.description} />
        <ProductSpecTab specs={product?.spec} />
        <div className="w-full md:col-span-2 ">
          <ProductRatingTab id={params.id} />
        </div>
      </div>
      <p className="text-2xl font-semibold my-4 ">
        Products from {product?.category?.category_name}
      </p>
      <ul className="w-full overflow-scroll no-scrollbar flex flex-row gap-2">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <ProductCard key={index} loading={true} />
            ))
          : products
              .filter((pd) => pd.category?._id === product?.category?._id)
              .map((pd) => <ProductCard key={pd._id} product={pd} />)}
      </ul>
      <p className="text-2xl font-semibold my-4 ">Explore other products</p>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 overflow-visible w-full">
        {isLoading
          ? Array.from({ length: 16 }).map((_, index) => (
              <ProductCard key={index} loading={true} />
            ))
          : products.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
      </ul>
    </section>
  );
};

export default Product;
