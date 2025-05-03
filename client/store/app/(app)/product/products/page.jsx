"use client";
import ProductSection from "@components/dashboardSection/ProductSection";
import FilterButton from "@components/Input/FilterButton";
import InputBox from "@components/Input/InputBox";
import ProductCard from "@components/UI/Product/ProductCard";
import { text } from "@node_modules/@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faAngleRight,
  faArrowDownAZ,
  faArrowUpAZ,
  faBox,
  faCalendar,
  faMoneyBill,
  faSearch,
  faSort,
  faSortAlphaAsc,
  faSortAlphaDesc,
  faSortNumericAsc,
  faSortNumericDesc,
  faStar,
  faTag,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { getAllCategory } from "@service/category";
import { getAllProduct } from "@service/product";
import React, { useEffect, useState } from "react";

const Product = () => {
  const PRODUCT_LIMIT = 24;
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [pendingText, setPendingText] = useState("");
  const [searchText, setSearchText] = useState("");

  const [dateSort, setDateSort] = useState(0);
  const [priceSort, setPriceSortPrice] = useState(0);
  const [ratingSort, setRatingSort] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchText(pendingText);
    }
  };

  const fetchProducts = async () => {
    getAllProduct()
      .then((res) => {
        setProducts(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchCategories = async () => {
    getAllCategory()
      .then((res) => {
        const formattedCategories = res.map((cate) => ({
          id: cate._id,
          name: cate.category_name,
        }));
        setCategories([{ id: 0, name: "none" }, ...formattedCategories]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    fetchProducts();
    fetchCategories();
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  let sortedProducts = [...products];

  if (dateSort === 1) {
    sortedProducts.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    ); // Oldest first
  } else if (dateSort === -1) {
    sortedProducts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    ); // Newest first
  }

  if (priceSort === 1) {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (priceSort === -1) {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  if (ratingSort === 1) {
    sortedProducts.sort((a, b) => a.average_rating - b.average_rating);
  } else if (ratingSort === -1) {
    sortedProducts.sort((a, b) => b.average_rating - a.average_rating);
  }

  const filteredProducts = sortedProducts.filter((item) => {
    const matchesCategory =
      selectedCategory && selectedCategory.id !== 0
        ? item.category._id === selectedCategory
        : true;

    const matchesSearchText = searchText
      ? item.product_name.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return matchesCategory & matchesSearchText;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="title">
        <FontAwesomeIcon icon={faBox} /> Products
      </div>
      <ProductSection />
      <div className="panel-3">
        <div className="rounded-full grow bg-primary-variant text-base flex flex-row items-center p-1">
          <input
            type="text"
            className="grow h-full bg-transparent  px-2 text-on-primary placeholder:text-on-primary outline-none"
            placeholder="Search product"
            onChange={(e) => setPendingText(e.target.value)}
            onKeyDown={handleSearch}
          />
          <button
            onClick={handleSearch}
            className="text-xl text-surface rounded-full bg-on-surface h-full aspect-square flex items-center justify-center p-1"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>
      {/* filter */}
      <div className="flex-wrap-reverse gap-4 flex items-center justify-end h-fit shadow-lg rounded-xl w-full bg-surface py-2 px-4 panel-3">
        <h2 className="text-lg mr-auto font-bold">
          {filteredProducts.length} results
        </h2>
        <div className="flex flex-wrap gap-4 panel-3">
          <FilterButton
            name={"rating"}
            icon={faSort}
            option={[
              { text: "All", value: 0, icon: faStar },
              { text: "Desc", value: -1, icon: faSortNumericDesc },
              { text: "Asc", value: 1, icon: faSortNumericAsc },
            ]}
            onChange={setRatingSort}
          />
          <FilterButton
            name={"date"}
            icon={faSort}
            option={[
              { text: "All", value: 0, icon: faCalendar },
              { text: "Oldest", value: 1, icon: faArrowDownAZ },
              { text: "Latest", value: -1, icon: faArrowUpAZ },
            ]}
            onChange={setDateSort}
          />
          <FilterButton
            name={"price"}
            icon={faSort}
            option={[
              { text: "All", value: 0, icon: faMoneyBill },
              { text: "Desc", value: -1, icon: faSortNumericDesc },
              { text: "Asc", value: 1, icon: faSortNumericAsc },
            ]}
            onChange={setPriceSortPrice}
          />
          <FilterButton
            name={"category"}
            icon={faTag}
            option={categories.map((item) => ({
              text: item.name,
              value: item.id,
              icon: faTag,
            }))}
            onChange={setSelectedCategory}
          />
        </div>
      </div>
      {/* product list */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 overflow-visible">
        {isLoading
          ? Array.from({ length: PRODUCT_LIMIT }).map((_, index) => (
              <ProductCard key={index} loading={true} />
            ))
          : filteredProducts
              .slice((page - 1) * PRODUCT_LIMIT, page * PRODUCT_LIMIT)
              .map((item) => <ProductCard key={item._id} product={item} />)}
      </ul>
      {/* page selector */}
      <ul className="flex my-4 gap-2 flex-row items-center justify-center bg-background/20 backdrop-blur-sm rounded-xl size-fit m-auto">
        <button
          className="p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10"
          onClick={() => setPage(Math.max(page - 1, 1))}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        {Array.from({
          length: Math.ceil(filteredProducts.length / PRODUCT_LIMIT),
        }).map((_, index) => (
          <button
            key={index}
            className={`${
              page === index + 1 ? "bg-surface" : ""
            } p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10`}
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10"
          onClick={() =>
            setPage(
              Math.min(
                page + 1,
                Math.ceil(filteredProducts.length / PRODUCT_LIMIT)
              )
            )
          }
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </ul>
    </div>
  );
};

export default Product;
