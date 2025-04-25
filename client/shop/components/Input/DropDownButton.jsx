"use client";
import { faAngleDown, faAngleUp, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";

const DropDownButton = ({value, name, options, onChange,zIndex=10 }) => {
  const [list, setList] = useState(options);
  const [isDropDown, setIsDropDown] = useState(false);

  useEffect(() => {
    setList(options);
  }, [options]);
  const handleChangeOption = (item) => {
    onChange(item);
    setIsDropDown(false);
  };

  return (
    <div className="relative" style={{ zIndex:zIndex }}>
      <div className="relative p-0 gap-2 grid grid-cols-[1fr_auto] max-w-[200px] w-[200px] h-fit rounded-xl text-base items-center bg-primary border-[2px] border-secondary overflow-hidden z-50 ">
        <div className="px-2 overflow-x-scroll no-scrollbar whitespace-nowrap">{value?.name||name}</div>
        <button
          className="p-1 bg-secondary text-on-secondary w-8 aspect-square"
          onClick={() => setIsDropDown((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faAngleDown} className={`transition-transform duration-200 ${isDropDown?'-scale-y-100':'scale-y-100'}`}/>
        </button>
      </div>
      {isDropDown && (
        <div className="absolute top-[100%] w-full max-h-[200px] h-[200px] max-w-[200px] overflow-y-scroll no-scrollbar bg-secondary text-on-secondary -mt-5 pt-5 z-40  shadow-2xl shadow-on-primary/10 break-all rounded-b-lg">
          <ul className="flex flex-col items-start px-2 ">
            {list?.map((item) => (
              <li
                key={item.id}
                onClick={() => handleChangeOption(item)}
                className="cursor-pointer hover:bg-on-secondary hover:text-secondary hover:font-semibold hover:scale-110 w-full py-1 transition-all duration-200"
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropDownButton;
