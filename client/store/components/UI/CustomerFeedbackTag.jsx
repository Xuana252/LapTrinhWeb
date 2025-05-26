import React from "react";
import ProductCard from "./Product/ProductCard";
import FeedbackTag from "./FeedbackTag";

const CustomerFeedbackTag = ({ feedback, loading }) => {
  if (loading)
    return (
      <div className="rounded bg-surface p-1 flex flex-col gap-2">
        <ProductCard loading={true} />
        <FeedbackTag loading={true} />
      </div>
    );

  return (
    <div className="rounded bg-surface p-2 flex flex-col gap-2">
      <ProductCard product={feedback.product_id} />
      <FeedbackTag feedback={feedback} />
    </div>
  );
};

export default CustomerFeedbackTag;
