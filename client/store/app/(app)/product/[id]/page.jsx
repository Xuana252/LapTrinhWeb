"use client";
import { formattedPrice } from "@util/format";
import {
  getProductDetail,
  getAllProduct,
  deleteProduct,
  updateProduct,
} from "@service/product";

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
import { toastError, toastRequest, toastSuccess } from "@util/toaster";
import ProductRevenueTab from "@components/UI/Product/ProductRevenueTab";
import { upload } from "@util/uploader";

const Product = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const [product, setProduct] = useState(null);

  const [categories, setCategories] = useState([]);

  const handleDelete = async () => {
    const result = await toastRequest("Do you  want to delete this product");
    if (result) {
      setIsLoading(true);
      try {
        deleteProduct(params.id).then((res) => {
          if (res) toastSuccess("Product deleted");
          else toastError("Failed to delete product");
        });
      } catch (error) {
        toastError("Failed to delete product");
      }
      setIsLoading(false);
    }
  };

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

      console.log(payload);

      updateProduct(params.id, payload).then((res) => {
        if (res) toastSuccess("Product updated successfully");
        else toastError("Failed to update product");
      });
    } catch (error) {
      toastError("Fail to update product");
    }
    setIsLoading(false);
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
  const updateProductInfo = (name, value) => {
    product && setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const fetchProductDetails = (id) => {
    setIsLoading(true);
    getProductDetail(id).then((data) => {
      const formattedProduct = {
        ...data,
        image: data.image.map((img, index) => ({
          name: "",
          url: img,
        })),
      };
      setProduct(formattedProduct);
      setTimeout(() => setIsLoading(false), 1000);
    });
  };

  useEffect(() => {
    fetchCategories();
    fetchProductDetails(params.id);
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
              onChange={(i) => updateProductInfo("image", i)}
            />
            <div className="flex flex-col gap-4 md:p-8 sm:panel-1 ">
              <textarea
                value={product?.product_name}
                className="font-bold text-xl md:text-3xl outline-none bg-transparent resize-none"
                onChange={(e) =>
                  updateProductInfo("product_name", e.target.value)
                }
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

              <div className="  flex flex-wrap gap-1 items-center justify-start">
                <span>price: </span>
                <PriceInput
                  value={product?.price}
                  onChange={(d) => updateProductInfo("price", d)}
                />
                {product?.discount > 0 && (
                  <span className="rounded px-1 text-white bg-red-500 font-semibold">
                    -{product.discount}%
                  </span>
                )}
                {product?.category.discount > 0 && (
                  <span className="rounded px-1 text-white bg-green-500 font-semibold">
                    -{product.category.discount}%
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
                  onChange={(d) => updateProductInfo("discount", d)}
                  max={100}
                  min={0}
                  value={product?.discount}
                />
              </div>
              <div className="flex flex-wrap gap-2 ">
                <span>quantity: </span>
                <QuantityInput
                  onChange={(q) => updateProductInfo("stock_quantity", q)}
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
          onChange={(d) => updateProductInfo("description", d)}
        />
        <ProductSpecTab
          specs={product?.spec}
          onChange={(s) => updateProductInfo("spec", s)}
        />
      </div>
      <ProductRevenueTab id={params.id} />
      <ProductRatingTab id={params.id} />
    </section>
  );
};

export default Product;
