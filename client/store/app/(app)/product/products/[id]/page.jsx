"use client";
import { formattedPrice } from "@util/format";
import { getProductDetail, getAllProduct } from "@service/product";

import ProductCard from "@components/UI/Product/ProductCard";
import ReviewStar from "@components/UI/ReviewStar";

import {
  faCartShopping,
  faMinus,
  faPlus,
  faSave,
  faSpinner,
  faTag,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useRouter } from "@node_modules/next/navigation";

import React, { useEffect, useReducer, useRef, useState } from "react";

import Link from "@node_modules/next/link";

import ProductRatingTab from "@components/UI/Product/ProductRatingTab";
import ProductDescriptionTab from "@components/UI/Product/ProductDescriptionTab";
import ProductSpecTab from "@components/UI/Product/ProductSpecTab";
import ProductImageTab from "@components/UI/Product/ProductImageTab";
import QuantityInput from "@components/Input/QuantityInput";
import PriceInput from "@components/Input/PriceInput";
import FilterButton from "@components/Input/FilterButton";
import { getAllCategory } from "@service/category";
import { toastRequest, toastSuccess } from "@util/toaster";
import ProductRevenueSection from "@components/UI/Product/ProductRevenueTab";
const Product = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const [product, setProduct] = useState(null);

  const [categories, setCategories] = useState([]);

  const handleDelete = () => {
    toastRequest("Are you sure you want to delete this product?");
  };

  const handleSave = () => {
    toastSuccess("Product updated successfully");
  };

  const fetchCategories = async () => {
    getAllCategory()
      .then((res) => {
        setCategories(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeProductCategory = (categoryId) => {
    setProduct((prev) => ({
      ...prev,
      category: categories.find((c) => c._id === categoryId),
      category_id: categoryId,
    }));
  };
  const updateProduct = (name, value) => {
    product && setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const fetchProductDetails = (id) => {
    getProductDetail(id).then((data) => {
      const formattedProduct = {
        ...data,
        image: data.image.map((img, index) => ({
          name: img + index,
          url: img,
        })),
      };
      setProduct(formattedProduct);
    });
  };

  useEffect(() => {
    setIsLoading(true);
    fetchCategories();
    fetchProductDetails(params.id);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <section className="size-full h-fit flex flex-col items-center gap-4 overflow-visible">
      <div className="panel-3 w-full flex flex-wrap justify-end items-center gap-2">
        <button
          onClick={handleSave}
          className="bg-green-500  text-white p-1 rounded-lg active:opacity-80 transition-colors duration-200 ease-out gap-2 flex items-center justify-center h-fit"
        >
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : (
            <>
              Save
              <FontAwesomeIcon icon={faSave} />
            </>
          )}
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500  text-white p-1 rounded-lg active:opacity-80 transition-colors duration-200 ease-out gap-2 flex items-center justify-center h-fit"
        >
          {" "}
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : (
            <>
              Delete
              <FontAwesomeIcon icon={faTrash} />
            </>
          )}
        </button>
      </div>
      <div className=" panel-2 w-full grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 lg:gap-10 ">
        {isLoading ? (
          <>
            <div className="rounded animate-pulse h-[500px] w-full min-w-[250px] max-w-[500px] bg-surface"></div>
            <div className="rounded animate-pulse h-[300px] bg-surface"></div>
          </>
        ) : (
          <>
            <ProductImageTab
              images={product?.image}
              onChange={(i) => updateProduct("image", i)}
            />
            <div className="flex flex-col gap-4 md:p-8 sm:panel-1 ">
              <textarea
                value={product?.product_name}
                className="font-bold text-xl md:text-3xl outline-none bg-transparent resize-none"
                onChange={(e) => updateProduct("product_name", e.target.value)}
                placeholder="Product name"
              />
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
                <div className="  flex flex-wrap gap-1 items-center justify-start">
                  <span>price: </span>
                  <PriceInput
                    value={product.price}
                    onChange={(d) => updateProduct("price", d)}
                  />
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

              <div>
                <FilterButton
                  name={"category"}
                  icon={faTag}
                  option={categories.map((item) => ({
                    text: item.category_name,
                    value: item._id,
                    icon: faTag,
                  }))}
                  selected={product?.category_id}
                  onChange={changeProductCategory}
                />
              </div>

              <div className="flex flex-wrap gap-2 ">
                <span>discount: </span>
                <QuantityInput
                  onChange={(d) => updateProduct("discount", d)}
                  max={100}
                  min={0}
                  value={product?.discount}
                />
              </div>
              <div className="flex flex-wrap gap-2 ">
                <span>quantity: </span>
                <QuantityInput
                  onChange={(q) => updateProduct("stock_quantity", q)}
                  max={999999}
                  value={product?.stock_quantity}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] w-full">
        <ProductDescriptionTab
          description={product?.description}
          onChange={(d) => updateProduct("description", d)}
        />
        <ProductSpecTab
          specs={product?.spec}
          onChange={(s) => updateProduct("spec", s)}
        />
      </div>
      <ProductRevenueSection id={params.id} />
      <div className="w-full ">
        <ProductRatingTab id={params.id} />
      </div>
    </section>
  );
};

export default Product;
