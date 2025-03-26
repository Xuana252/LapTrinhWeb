"use client";
import React, { useRef } from "react";

const PhoneInput = ({ value, name, onChange, maxLength = 15  }) => {
  const labelRef = useRef(null); // Create a reference for the label

  const handleFocus = () => {
    labelRef.current.classList.remove("scale-110","translate-y-5");
  };

  const handleBlur = (e) => {
    if (e.target.value === "") {
      labelRef.current.classList.add("scale-110","translate-y-5");
    }
  };

  const onTextChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    onChange(numericValue.slice(0, maxLength));
  };

  return (
    <div className="relative bg-inherit w-full">
      <span
        ref={labelRef}
        className={`-top-3 ${value?"":"translate-y-5 scale-110"}  absolute font-semibold bg-inherit left-3 text-xs px-2 text-on-background/50 pointer-events-none transition-transform duration-200 transform `}
      >
        {name}
      </span>
      <input
        type="tel"
        placeholder=""
        value={value}
        className="bg-transparent rounded-lg border-[1px] border-on-background/50  text-base outline-none p-2 py-2 w-full"
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
        onChange={onTextChange}
      />
    </div>
  );
};

export default PhoneInput;
