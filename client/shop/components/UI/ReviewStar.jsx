"use client";
import {
  faStar as faEmptyStar,
  faStarHalf,
} from "@fortawesome/free-regular-svg-icons";
import {
  faAngleLeft,
  faAngleRight,
  faCartShopping,
  faStar as faFullStar,
  faStarHalfStroke,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

const ReviewStar = ({ rating, size, editable = false, onChange= (num)=>{} }) => {
  const [editRating, setEditRating] = useState(rating);
  const handleMouseHover = (index) => {
    setEditRating(index);
  };

  const handleMouseLeave = () => {
    setEditRating(rating)
  }

  const handleMouseClick = (index) => {
    onChange(index===rating?1:index)
  }

  useEffect(()=>{setEditRating(rating)},[rating])
  return (
    <ul className={`flex flex-row gap-1 items-center text-yellow-400 ${size}`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const fullStars = Math.round(editRating);
        const hasHalfStar = editRating % 1 < 0.5 && editRating % 1 !== 0;
        return (
          <FontAwesomeIcon
            onClick={()=>handleMouseClick(index+1)}
            className={`${editable ? "cursor-pointer" : ""}`}
            onMouseEnter={() => (editable ? handleMouseHover(index + 1) : {})}
            onMouseLeave={handleMouseLeave}
            key={index}
            icon={
              index < fullStars
                ? faFullStar
                : index === fullStars && hasHalfStar
                ? faStarHalfStroke
                : faEmptyStar
            }
          />
        );
      })}
    </ul>
  );
};

export default ReviewStar;
