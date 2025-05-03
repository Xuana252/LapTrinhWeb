import { addFeedback, getFeedbacks } from "@service/feedback";
import React, { useEffect, useState } from "react";

import InputArea from "@components/Input/InputArea";

import { toastError, toastSuccess } from "@util/toaster";
import FeedbackTag from "../FeedbackTag";
import ReviewStar from "../ReviewStar";
import ProfileImageHolder from "../ProfileImageHolder";

const ProductRatingTab = ({ id }) => {
  const [productFeedbacks, setProductFeedBacks] = useState([]);
  const [feedbackFilter, setFeedbackFilter] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);

  const productRating =
    productFeedbacks?.length > 0
      ? parseFloat(
          (
            productFeedbacks.reduce(
              (acc, feedback) => acc + feedback.rating,
              0
            ) / productFeedbacks.length
          ).toFixed(1)
        )
      : 0;

  const handleSetFeedbackFilter = (rate) => {
    setFeedbackFilter(rate === feedbackFilter ? -1 : rate);
  };

  const fetchProductFeedbacks = (id) => {
    setIsLoading(true);
    getFeedbacks(id).then((data) => {
      setProductFeedBacks(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    id && fetchProductFeedbacks(id);
  }, [id]);

  return (
    <div className="flex flex-col gap-2 w-full panel-2 ">
      <div className="bg-primary-variant rounded-md text-on-primary md:text-xl font-bold text-center p-2">
        Product ratings
      </div>
      <div className="flex flex-col md:flex-row gap-2 justify-start items-center shadow-inner rounded-xl p-2">
        <div className="flex flex-col gap-2 items-center">
          <span className="text-2xl md:text-3xl text-yellow-400 font-bold">
            {" "}
            {productRating} / 5
          </span>
          <ReviewStar rating={productRating} size={"text-2xl"} />
        </div>
        <ul className="flex flex-wrap gap-4">
          {[5, 4, 3, 2, 1].map((value) => (
            <button
              key={value}
              onClick={() => handleSetFeedbackFilter(value)}
              className={`flex flex-row gap-1 items-center ${
                feedbackFilter === value
                  ? "border-yellow-400"
                  : "border-surface"
              } border-2  bg-surface   text-sm p-2  rounded-xl`}
            >
              <ReviewStar rating={value} />
              <span className="text-on-surface">
                (
                {
                  productFeedbacks.filter(
                    (feedback) => feedback.rating === value
                  ).length
                }
                )
              </span>
            </button>
          ))}
        </ul>
      </div>
      <h2>
        {
          productFeedbacks.filter(
            (item) => item.rating === feedbackFilter || feedbackFilter === -1
          ).length
        }{" "}
        reviews
      </h2>
      <ul className="flex flex-col gap-4 py-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <FeedbackTag key={index} loading={true} />
            ))
          : productFeedbacks
              .sort((a, b) => b.rating - a.rating)
              .filter(
                (item) =>
                  item.rating === feedbackFilter || feedbackFilter === -1
              )
              .map((feedback) => (
                <FeedbackTag key={feedback._id} feedback={feedback} />
              ))}
      </ul>
    </div>
  );
};

export default ProductRatingTab;
