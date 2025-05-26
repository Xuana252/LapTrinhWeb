"use client";
import Chart from "@components/UI/Chart";
import { NumberLoader } from "@components/UI/Loader";
import { formatNumber, formattedPrice } from "@util/format";
import {
  faCalendar,
  faUserPlus,
  faUserClock,
  faCalendarDay,
  faAnglesUp,
  faAnglesDown,
  faAnglesRight,
  faTrophy,
  faUserAltSlash,
  faUsers,
  faBox,
  faBoxes,
  faBoxesPacking,
  faBook,
  faTags,
  faList,
  faBookReader,
  faWallet,
  faAngleRight,
  faAngleLeft,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { getProductsRevenue } from "@service/product";
import ProductCard from "@components/UI/Product/ProductCard";
import { getCustomerRevenue } from "@service/customer";
import FeedbackTag from "../FeedbackTag";
import ReviewStar from "../ReviewStar";
import { getCustomerFeedbacks } from "@service/feedback";
import CustomerFeedbackTag from "../CustomerFeedbackTag";

export default function CustomerFeedbacksTab({ id }) {
  const FEEDBACK_LIMIT = 4;
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackFilter, setFeedbackFilter] = useState(-1);

  const handleSetFeedbackFilter = (rate) => {
    setFeedbackFilter(rate === feedbackFilter ? -1 : rate);
  };

  const fetchCustomerFeedbacks = () => {
    setIsLoading(true);
    getCustomerFeedbacks(id)
      .then((res) => {
        setFeedbacks(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => setIsLoading(false), 1000);
  };

  useEffect(() => {
    setPage(1);
  }, [feedbackFilter]);
  useEffect(() => {
    id && fetchCustomerFeedbacks();
  }, [id]);

  const filteredFeedbacks = feedbacks
    ?.sort((a, b) => b.rating - a.rating)
    .filter((item) => item.rating === feedbackFilter || feedbackFilter === -1);

  return (
    <div className="flex flex-col gap-2 w-full panel-3 ">
      <div className="bg-primary-variant rounded-md text-on-primary md:text-xl font-bold text-center p-2">
        Product ratings
      </div>
      <div className="flex flex-col md:flex-row gap-2 justify-start items-center shadow-inner rounded-xl p-2">
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
                  feedbacks?.filter((feedback) => feedback.rating === value)
                    .length
                }
                )
              </span>
            </button>
          ))}
        </ul>
      </div>
      <h2>
        {
          feedbacks?.filter(
            (item) => item.rating === feedbackFilter || feedbackFilter === -1
          ).length
        }{" "}
        reviews
      </h2>

      {/* feedback list */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-visible">
        {isLoading
          ? Array.from({ length: FEEDBACK_LIMIT }).map((_, index) => (
              <CustomerFeedbackTag key={index} loading={true} />
            ))
          : filteredFeedbacks
              .slice((page - 1) * FEEDBACK_LIMIT, page * FEEDBACK_LIMIT)
              .map((item) => (
                <CustomerFeedbackTag key={item._id} feedback={item} />
              ))}
      </ul>
      {/* page selector */}
      <ul className="flex my-4 gap-2 flex-row items-center justify-center bg-background/20 backdrop-blur-sm rounded-xl size-fit m-auto text-on-surface">
        <button
          className="p-2 rounded-lg hover:bg-surface active:bg-secondary-variant/20 text-lg size-10"
          onClick={() => setPage(Math.max(page - 1, 1))}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        {Array.from({
          length: Math.ceil(filteredFeedbacks.length / FEEDBACK_LIMIT),
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
                Math.ceil(filteredFeedbacks.length / FEEDBACK_LIMIT)
              )
            )
          }
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </ul>
    </div>
  );
}
