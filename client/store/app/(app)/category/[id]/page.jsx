"use client";
import QuantityInput from "@components/Input/QuantityInput";
import CategoryRevenueTab from "@components/UI/CategoryRevenueTab";
import {
  faSave,
  faSpinner,
  faTable,
  faTag,
  faTrash,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useParams } from "@node_modules/next/navigation";
import { deleteCategory, getCategory, updateCategory } from "@service/category";
import { toastError, toastRequest, toastSuccess } from "@util/toaster";
import React, { useEffect, useState } from "react";

const Category = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState();

  const handleDelete = async () => {
    const result = await toastRequest("Do you  want to delete this category");
    if (result) {
      try {
        deleteCategory(params.id).then((res) => {
          if (res) toastSuccess("Category deleted");
          else toastError("Failed to delete category");
        });
      } catch (error) {
        toastError("Failed to delete category");
      }
    }
  };

  const handleSave = () => {
    try {
      const payload = {
        category_name: category.category_name,
        discount: category.discount,
      };

      updateCategory(params.id, payload).then((res) => {
        if (res) toastSuccess("Category updated successfully");
        else toastError("Failed to update category");
      });
    } catch (error) {
      toastError("Fail to update category");
    }
  };

  const fetchCategory = async (id) => {
    setIsLoading(true);
    getCategory(id)
      .then((res) => {
        setCategory(res);
        setTimeout(() => setIsLoading(false), 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateCategoryInfo = (name, value) => {
    category && setCategory((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    
    fetchCategory(params.id);
    
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
      <div className=" panel-3 w-full grid grid-cols-1  gap-4  ">
        {isLoading ? (
          <>
            <div className="rounded animate-pulse h-[100px] w-full bg-surface"></div>
            <div className="rounded animate-pulse h-[30px] w-[100px] bg-surface"></div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
      <CategoryRevenueTab id={params.id} />
    </section>
  );
};

export default Category;
