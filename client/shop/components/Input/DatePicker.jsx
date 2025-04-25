"use client";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formattedDate } from "@util/format";
import React, { useEffect, useRef } from "react";

const DatePicker = ({ name, value, onChange, monthOnly = false }) => {
  const labelRef = useRef(null); // Create a reference for the label
  const datePickerRef = useRef(null);

  const handleDateChange = (e) => {
    const value = formattedDate(new Date(e.target.value));
    onChange(value);
  };


  const handleFocus = () => {
    labelRef.current.classList.remove("scale-110", "translate-y-5");
  };

  const handleBlur = (e) => {
    if (e.target.value === "") {
      labelRef.current.classList.add("scale-110", "translate-y-5");
    }
  };

  return (
    <div
      className="relative bg-inherit rounded-lg border-[1px] border-on-background/50 outline-none h-fit w-full"

    >
      <span
        ref={labelRef}
        className={`-top-3 ${
          value ? "" : "translate-y-5 scale-110"
        }  absolute font-semibold bg-inherit left-3 text-xs px-2 text-on-background/50 pointer-events-none transition-transform duration-200 transform `}
      >
        {name}
      </span>
      <div className="relative flex flex-row grow p-2 py-2 text-base">
        <input
          ref={datePickerRef}
          type={monthOnly ? "month" : "date"}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={false}
          tabIndex={-1}
          onKeyDown={(e) => e.preventDefault()}
          className="bg-transparent text-accent w-full pointer-events-none outline-none opacity-0 absolute top-0 left-0"
          onChange={handleDateChange}
        />
        <div className="text-accent grow px-2">{value ? value : ""}</div>
        <button
          className=""
          onClick={(e) => {
            e.preventDefault();
            datePickerRef.current && datePickerRef.current.showPicker();
          }}
        >
          <FontAwesomeIcon icon={faCalendar} />
        </button>
      </div>
    </div>
  );
};

export default DatePicker;
