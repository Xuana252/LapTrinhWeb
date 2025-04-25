"use client";
import DropDownButton from "@components/Input/DropDownButton";
import ProductCard from "@components/UI/ProductCard";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "@node_modules/next/navigation";
import { getAllCategory } from "@service/category";
import { getAllProduct } from "@service/product";
import React, { useEffect, useState } from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlSearchText = searchParams.get("searchText");
  const PRODUCT_LIMIT = 12;
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const priceRange = [
    { id: 0, name: "none" },
    { id: 1, name: "<= 10M VNĐ" },
    { id: 2, name: "> 10M VNĐ, <50M VNĐ" },
    { id: 3, name: ">= 50M VNĐ" },
  ];
  const [categories, setCategories] = useState([]);

  const [selectedPriceRange, setSelectedPriceRange] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  const fetchPosts = () => {
    setIsLoading(true);
    getAllProduct().then((data) => setProducts(data));
    setTimeout(() => setIsLoading(false), 1000);
  };
  const fetchCategories = () => {
    getAllCategory().then((data) => {
      const formattedCategories = data.map((cate) => ({
        id: cate.category_id,
        name: cate.category_name,
      }));
      setCategories([{ id: 0, name: "none" }, ...formattedCategories]);

      if (urlCategory) {
        const foundCategory = formattedCategories.find(
          (cate) => cate.id == urlCategory
        );
        setSelectedCategory(foundCategory || null); // Set to null if no category is found
      }
    });
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const isWithinPriceRange = (price) => {
    if (!selectedPriceRange) return true; // If no price range is selected, don't filter by price

    switch (selectedPriceRange.id) {
      case 1:
        return price < 10000000;
      case 2:
        return 10000000 < price && price < 50000000;
      case 3:
        return price > 50000000;
      default:
        return true; // If no valid price range, don't filter by price
    }
  };

  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory && selectedCategory.id !==0
      ? item.categories[0]?.category_id === selectedCategory.id
      : true;
    const matchesPriceRange = isWithinPriceRange(item.price);

    const matchesSearchText = urlSearchText
    ? item.product_name.toLowerCase().includes(urlSearchText.toLowerCase())
    : true;
    return matchesCategory && matchesPriceRange && matchesSearchText;
  });

  return (
    <section className="flex flex-col gap-4 overflow-visible">
      {/* filter */}
      <div className="flex-wrap-reverse gap-4 flex items-center justify-end h-fit shadow-lg rounded-xl w-full bg-surface    py-2 px-4">
        <h2 className="text-lg mr-auto font-bold">
          {filteredProducts.length} results
        </h2>
        <DropDownButton
          value={selectedPriceRange}
          name={"price range"}
          options={priceRange}
          onChange={setSelectedPriceRange}
        /> 
        <DropDownButton
          value={selectedCategory}
          name={"category"}
          options={categories}
          onChange={setSelectedCategory}
        />
      </div>
      {/* product list */}
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 overflow-visible">
        {isLoading
          ? Array.from({ length: PRODUCT_LIMIT }).map((_, index) => (
              <ProductCard key={index} loading={true} />
            ))
          : filteredProducts
              .slice((page - 1) * PRODUCT_LIMIT, page * PRODUCT_LIMIT)
              .map((item) => (
                <ProductCard key={item.product_id} product={item} />
              ))}
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
              Math.min(page + 1, Math.ceil(filteredProducts.length / PRODUCT_LIMIT))
            )
          }
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </ul>
    </section>
  );
}
