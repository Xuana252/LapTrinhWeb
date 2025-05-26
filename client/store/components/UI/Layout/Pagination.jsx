import InputBox from "@components/Input/InputBox";
import {
  faAngleLeft,
  faAngleRight,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction, useEffect } from "react";

export default function Pagination({
  limit,
  count,
  current,
  onPageChange,
}) {
  const totalPages = Math.ceil(count / limit);

  const handleClick = (page) => {
    if (page !== current && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  useEffect(()=> {
    if(current>totalPages) 
      onPageChange(1)
  },[totalPages])

  const getPagesToDisplay = () => {
    const pages = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (current > 4) {
      pages.push("...");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const displayPages = getPagesToDisplay();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const input = e.currentTarget.value.trim();
      const pageNum = parseInt(input);

      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        onPageChange(pageNum); // replace with your page change function
      }
    }
  };

  return (
    <div className="flex flex-wrap justify-center sm:justify-end  items-center gap-2 mt-4">
      <div className="flex items-center gap-2  text-sm justify-end">
        <button
          onClick={() => handleClick(current - 1)}
          disabled={current === 1}
       className="p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        {displayPages.map((page, idx) =>
          typeof page === "number" ? (
            <button
              key={idx}
              onClick={() => handleClick(page)}
              className={`${
                page === idx + 1 ? "bg-surface" : ""
              } p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10`}
            >
              {page}
            </button>
          ) : (
            <span key={idx} className="px-2 ">
              {page}
            </span>
          )
        )}
        <button
          onClick={() => handleClick(current + 1)}
          disabled={current === totalPages}
        className="p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10"
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>

         {/* <ul className="flex my-4 gap-2 flex-row items-center justify-center bg-background/20 backdrop-blur-sm rounded-xl size-fit m-auto">
        <button
          className="p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10"
          onClick={() => setPage(Math.max(page - 1, 1))}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        {Array.from({
          length: Math.ceil(filteredProducts.length / USER_LIMIT),
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
                Math.ceil(filteredProducts.length / USER_LIMIT)
              )
            )
          }
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </ul> */}

      <div className="flex flex-row gap-2 items-center">
        <span>Go to:</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          className="input-variant-1 px-2 text-center"
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
