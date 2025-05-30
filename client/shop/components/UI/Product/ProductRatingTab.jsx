import { addFeedback, getFeedbacks } from "@service/feedback";
import React, { useEffect, useState } from "react";

import InputArea from "@components/Input/InputArea";

import { useSession } from "@node_modules/next-auth/react";
import { useSelector } from "@node_modules/react-redux/dist/react-redux";
import { toastError, toastSuccess } from "@util/toaster";
import FeedbackTag from "../FeedbackTag";
import ReviewStar from "../ReviewStar";
import ProfileImageHolder from "../ProfileImageHolder";

const ProductRatingTab = ({ id }) => {
  const session = useSelector((state) => state.session);
  const [productFeedbacks, setProductFeedBacks] = useState([]);
  const [feedback, setFeedback] = useState({ rating: 0, content: "" });
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

  const handleAddFeedback = async () => {
    if (!session.isAuthenticated) {
      toastError("You need to login to proceed");
      return;
    }
    if (feedback.content.trim() === "") {
      toastWarning("Please add your feedback before submit");
      return;
    }

    const payload = {
      customer_id: session.customer._id,
      feedback: feedback.content,
      rating: feedback.rating,
    };

    await addFeedback(id,payload).then((data) => {
      if (data.feedback) {
        console.log("feedback", data.feedback);
        setProductFeedBacks((prev) => {

          const existingFeedbackIndex = prev.findIndex(
            (feedbackItem) => feedbackItem._id === data.feedback._id
          );

          if (existingFeedbackIndex >= 0) {
            // Feedback exists, replace it
            const updatedFeedbacks = [...prev];
            updatedFeedbacks[existingFeedbackIndex] = data.feedback;
            return updatedFeedbacks;
          } else {
            // Feedback does not exist, add it
            return [...prev, data.feedback];
          }
        });
        setFeedback({ content: "", rating: 0 });
        switch (data.feedback.rating) {
          case 0:
            toastSuccess(
              "We are sorry to hear you had a bad experience. Thank you for your feedback."
            );
            break;
          case 1:
            toastSuccess(
              "Thank you for your feedback. We strive to improve your experience."
            );
            break;
          case 2:
            toastSuccess(
              "Thank you for your input. We are working on making things better."
            );
            break;
          case 3:
            toastSuccess(
              "Thank you! We appreciate your feedback and will continue to improve."
            );
            break;
          case 4:
            toastSuccess(
              "Great to hear you had a good experience! Thank you for your feedback."
            );
            break;
          case 5:
            toastSuccess(
              "Awesome! Your feedback means a lot to us. Thank you for using our products!"
            );
            break;
          default:
            toastSuccess(
              "Thank you for your feedback! We appreciate your input."
            );
            break;
        }
      } else {
        toastError(data.message || "Failed to add feedback");
      }
    });
  };
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
      <div className="flex flex-col gap-4 bg-surface p-4 overflow-hidden rounded-lg">
        <div className="w-full grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-2">
          <ProfileImageHolder url={session?.customer?.image} size={32} />
          <div className="flex flex-col gap-2 items-start">
            <ReviewStar
              rating={feedback.rating}
              onChange={(num) => setFeedback((fb) => ({ ...fb, rating: num }))}
              size={"text-xl"}
              editable={true}
            />
            <span className="text-xs opacity-50">
              {new Date().toISOString().split("T")[0]}
            </span>
            <InputArea
              value={feedback.content}
              onTextChange={(e) =>
                setFeedback((fb) => ({ ...fb, content: e.target.value }))
              }
              placeholder="add a feedback"
            />
          </div>
        </div>
        <button className="w-full button-variant-1" onClick={handleAddFeedback}>
          Add feedback
        </button>
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
