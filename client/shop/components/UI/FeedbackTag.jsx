import {
  faCircleUser,
  faUserCircle,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React from "react";
import ReviewStar from "./ReviewStar";
import ProfileImageHolder from "./ProfileImageHolder";

const FeedbackTag = ({ feedback, loading = false }) => {
  if (loading)
    return (
      <li
        className="w-full grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-2 bg-surface p-2 rounded-lg"
      >
        <span className="text-3xl animate-pulse">
          <FontAwesomeIcon icon={faUserCircle} />
        </span>
        <div className="flex flex-col gap-2 items-start  animate-pulse">
          <span className="bg-primary w-[100px] h-5 rounded-lg"></span>
          <ReviewStar rating={0} size={"text-xs"} />
          <span className="text-xs bg-primary w-[50px] h-4 rounded-lg"></span>

          <p className="text-sm h-10 w-full bg-primary rounded-lg"></p>
        </div>
      </li>
    );

  return (
    <li
      key={feedback.feedback_id}
      className="w-full grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-2 bg-surface p-2 rounded-lg"
    >
      <ProfileImageHolder url={feedback.customer?.image} size={32}/>
      <div className="flex flex-col gap-2 items-start">
        <span className="font-semibold">{feedback.customer?.username}</span>
        <ReviewStar rating={feedback.rating} size={"text-xs"} />
        <span className="text-xs opacity-50">
          {new Date(feedback.created_at).toISOString().split("T")[0]}
        </span>

        <p className="text-sm">{feedback.feedback}</p>
      </div>
    </li>
  );
};

export default FeedbackTag;
