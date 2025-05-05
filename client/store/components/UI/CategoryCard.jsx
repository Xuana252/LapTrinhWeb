import { faTag } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import Link from "@node_modules/next/link";
import React from "react";

const CategoryCard = ({ loading, category }) => {
  if (loading)
    return (
      <div className="rounded p-2 bg-surface flex flex-col gap-2 panel-3">
        <div className="rounded bg-primary h-10">
        </div>
        <div className="h-6">
        </div>
      </div>
    );
  return (
    <Link
      href={`category/${category._id}`}
      className="rounded p-2 bg-surface flex flex-col gap-2 panel-3"
    >
      <div className="rounded bg-primary text-on-primary text-lg font-semibold flex flex-row gap-2 items-center font-mono text-left p-1">
        <FontAwesomeIcon icon={faTag} />
        {category.category_name}
      </div>
      <div>
        {" "}
        {category.discount > 0 && (
          <span className="rounded px-1 text-white bg-green-500 font-semibold">
            -{category.discount}%
          </span>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
