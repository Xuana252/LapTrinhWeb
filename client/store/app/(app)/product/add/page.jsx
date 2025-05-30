"use client";
import { formattedPrice } from "@util/format";
import {
  getProductDetail,
  getAllProduct,
  createProduct,
} from "@service/product";

import ProductCard from "@components/UI/Product/ProductCard";
import ReviewStar from "@components/UI/ReviewStar";

import {
  faAdd,
  faCartShopping,
  faMinus,
  faPlus,
  faSave,
  faSpinner,
  faTag,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React, { useEffect, useReducer, useRef, useState } from "react";

import ProductRatingTab from "@components/UI/Product/ProductRatingTab";
import ProductDescriptionTab from "@components/UI/Product/ProductDescriptionTab";
import ProductSpecTab from "@components/UI/Product/ProductSpecTab";
import ProductImageTab from "@components/UI/Product/ProductImageTab";
import QuantityInput from "@components/Input/QuantityInput";
import PriceInput from "@components/Input/PriceInput";
import FilterButton from "@components/Input/FilterButton";
import { getAllCategory } from "@service/category";
import { toastError, toastRequest, toastSuccess } from "@util/toaster";
import { upload } from "@util/uploader";
const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [product, setProduct] = useState({
    product_name: "",
    price: 0,
    discount: 0,
    image: [],
    category_id: "",
    category: null,
    description: "",
    spec: [],
  });

  const [categories, setCategories] = useState([]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const imageList = await Promise.all(
        product.image.map(async (img) => {
          if (img.name !== "") {
            return await upload(img.url, img.name);
          } else {
            return img.url;
          }
        })
      );
      const payload = {
        product_name: product.product_name,
        price: product.price,
        discount: product.discount,
        stock_quantity: product.stock_quantity,
        spec: product.spec,
        image: imageList,
        category_id: product.category_id,
      };

      createProduct(payload).then((res) => {
        if (res) toastSuccess("Product created successfully");
        else toastError("Failed to create product");
      });
    } catch (error) {
      toastError("Fail to create product");
    }
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    getAllCategory()
      .then((res) => {
        setCategories(res);
        setProduct((prev) => ({
          ...prev,
          category: res[0],
          category_id: res[0]._id,
        }));
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

  useEffect(() => {
    setIsLoading(true);
    fetchCategories();
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <section className="size-full h-fit flex flex-col items-center gap-4 overflow-visible">
      <div className="panel-3 w-full flex flex-wrap justify-end items-center gap-2">
        <button
          onClick={handleSave}
          className="bg-blue-500  text-white p-1 rounded-lg active:opacity-80 transition-colors duration-200 ease-out gap-2 flex items-center justify-center h-fit"
        >
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : (
            <>
              Add
              <FontAwesomeIcon icon={faAdd} />
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
                        product?.discount + (product?.category?.discount ?? 0),
                        100
                      )
                )}
              </div>

              <div className="  flex flex-wrap gap-1 items-center justify-start">
                <span>price: </span>
                <PriceInput
                  value={product?.price}
                  onChange={(d) => updateProduct("price", d)}
                />
                {product?.discount > 0 && (
                  <span className="rounded px-1 text-white bg-red-500 font-semibold">
                    -{product.discount}%
                  </span>
                )}
                {product?.category?.discount > 0 && (
                  <span className="rounded px-1 text-white bg-green-500 font-semibold">
                    -{product?.category?.discount}%
                  </span>
                )}
              </div>

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
    </section>
  );
};

export default AddProduct;
