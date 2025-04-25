"use client";
import React, { useState, useRef } from "react";

const RadioButton = ({ value, name, onChange,checked }) => {
  const radioButtonRef = useRef(null);

  const handleRadioClick = (e) => {
    e.preventDefault();
    radioButtonRef.current && radioButtonRef.current.click();
  };


  return (
    <>
      <button
        id={value}
        className="border-[2px] rounded-full border-on-background/50 size-5 md:size-6 p-[1px] md:p-[2px] flex items-center justify-center"
        onClick={handleRadioClick}
      >
        <div
          className={`origin-center size-[10px] bg-on-primary rounded-full transition-transform duration-200 ${
            checked ? "scale-100" : "scale-0"
          }`}
        ></div>
      </button>
      <input
        ref={radioButtonRef}
        id={value.toString()}
        name={name}
        type="radio"
        className="hidden"
        onChange={() => onChange(value)}
        checked={checked}
      />
    </>
  );
};

export default RadioButton;
