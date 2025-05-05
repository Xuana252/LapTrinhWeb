"use client";
import CategorySection from "@components/dashboardSection/CategorySection";
import ProductSection from "@components/dashboardSection/ProductSection";
import FilterButton from "@components/Input/FilterButton";
import InputBox from "@components/Input/InputBox";
import CategoryCard from "@components/UI/CategoryCard";
import ProductCard from "@components/UI/Product/ProductCard";
import { text } from "@node_modules/@fortawesome/fontawesome-svg-core";
import {
  faAdd,
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
import Link from "@node_modules/next/link";
import { getAllCategory } from "@service/category";
import { getAllProduct } from "@service/product";
import React, { useEffect, useState } from "react";

const Category = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    getAllCategory()
      .then((res) => {
        setCategories(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    fetchCategories();
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="title">
        <FontAwesomeIcon icon={faBox} /> Categories
      </div>
      <div className="flex-wrap-reverse gap-4 flex items-center justify-end h-fit shadow-lg rounded-xl w-full bg-surface py-2 px-4 panel-3">
        <div className="flex flex-wrap gap-4 panel-3">
          <Link
            href={`/category/add`}
            className="bg-blue-500  text-white p-1 rounded-lg active:opacity-80 transition-colors duration-200 ease-out gap-2 flex items-center justify-center h-fit"
          >
            Add
            <FontAwesomeIcon icon={faAdd} />
          </Link>
        </div>
      </div>
      <CategorySection />
      {/* filter */}
      {/* <div className="flex-wrap-reverse gap-4 flex items-center justify-end h-fit shadow-lg rounded-xl w-full bg-surface py-2 px-4 panel-3">
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
      </div> */}
      {/* product list */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 overflow-visible">
        {isLoading
          ? Array.from({ length: 9 }).map((_, index) => (
              <CategoryCard key={index} loading={true} />
            ))
          : categories.map((item) => (
              <CategoryCard key={item._id} category={item} />
            ))}
      </ul>
    </div>
  );
};

export default Category;
