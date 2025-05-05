"use client";
import QuantityInput from "@components/Input/QuantityInput";
import CategoryRevenueTab from "@components/UI/CategoryRevenueTab";
import {
    faAdd,
  faSave,
  faSpinner,
  faTable,
  faTag,
  faTrash,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useParams } from "@node_modules/next/navigation";
import { createCategory } from "@service/category";
import { toastError, toastRequest, toastSuccess } from "@util/toaster";
import React, { useEffect, useState } from "react";

const AddCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState({
    category_name:"",
    discount:0,
  });

  const handleSave = () => {
    try {
      const payload = {
        category_name: category.category_name,
        discount: category.discount,
      };

      createCategory(payload).then((res) => {
        if (res) toastSuccess("Category created successfully");
        else toastError("Fail to created category");
      });
    } catch (error) {
      toastError("Fail to created category");
    }
  };

  const updateCategoryInfo = (name, value) => {
    category && setCategory((prev) => ({ ...prev, [name]: value }));
  };

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
      <div className=" panel-3 w-full grid grid-cols-1  gap-4  ">
        <div className="panel-2 flex  text-xl md:text-3xl flex-row gap-2 items-start">
          <FontAwesomeIcon icon={faTag} />
          <textarea
            value={category?.category_name}
            className="font-bold outline-none bg-transparent resize-none grow "
            onChange={(e) =>
              updateCategoryInfo("category_name", e.target.value)
            }
            placeholder="Category name"
          />
        </div>

        <div className="bg-green-500 w-fit ">
          <QuantityInput
            max={100}
            min={0}
            value={category?.discount}
            onChange={(d) => updateCategoryInfo("discount", d)}
          />
        </div>
      </div>
    </section>
  );
};

export default AddCategory;
