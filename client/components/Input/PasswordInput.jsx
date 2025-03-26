"use client";
import { faEye, faEyeSlash, faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef,useState } from "react";

const PasswordInput = ({ value, name,onChange }) => {
    const [isVisible,setIsVisible] = useState(false)
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
    onChange(e.target.value);
  };

  return (
    <div className="relative bg-inherit rounded-lg border-[1px] border-on-background/50   outline-none  w-full">
      <span
        ref={labelRef}
        className={`-top-3 ${value?"":"translate-y-5 scale-110"}  absolute font-semibold bg-inherit left-3 text-xs px-2 text-on-background/50 pointer-events-none transition-transform duration-200 transform `}
      >
        {name}
      </span>
      <div className="flex gap-4">
          <input
            type={isVisible?'text':'password'}
            placeholder=""
            value={value}
            className="bg-transparent text-base outline-none p-2 py-2 w-full"
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete="new-password"
            onChange={onTextChange}
          />
          <button className='p-2' onClick={(e)=>{e.preventDefault();setIsVisible(prev=>!prev)}}>
            <FontAwesomeIcon icon={isVisible?faEye:faEyeSlash}/>
          </button>
      </div>
    </div>
  );
};

export default PasswordInput;
