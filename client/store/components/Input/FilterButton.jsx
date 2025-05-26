"use client";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useState } from "react";

export default function FilterButton({
  name,
  icon,
  option,
  onChange,
  selected,
}) {
  const [selectedIndex, setSelectedIndex] = useState(
    selected ? option.findIndex((o) => o.value === selected) : 0
  );
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSelect = (index) => {
    setIsSelecting(false);
    setSelectedIndex(index);
    onChange && onChange(option[index].value);
  };

  return (
    <div
      tabIndex={0}
      onBlur={() => setIsSelecting(false)}
      className="relative font-mono"
    >
      <div className="grid grid-cols-[auto_1fr] gap-1 items-center p-1 rounded-md bg-on-primary/20 border-secondary-1 border-2 w-fit">
        {name && (
          <>
            <div
              className="text-sm max-w-[100px] whitespace-nowrap  overflow-hidden text-ellipsis"
              title={name}
            >
              {name} {": "}
            </div>
          </>
        )}
        <button
          className="grid grid-cols-[1fr_auto] bg-secondary-variant text-on-secondary rounded-md px-2 py-1 gap-1 text-sm "
          onClick={() => setIsSelecting((prev) => !prev)}
        >
          <div className=" items-center flex justify-center">
            {option[selectedIndex]?.text}
          </div>
          <div className="flex items-center justify-center aspect-square h-full rounded-md bg-accent text-secondary-1">
            <FontAwesomeIcon icon={option[selectedIndex]?.icon ?? icon} />
          </div>
        </button>
      </div>

      <div
        className={`mt-1 bg-on-surface border-2 border-accent text-surface rounded-md w-fit absolute top-[100%] ${
          isSelecting ? "flex" : "hidden"
        } flex-col p-1 z-40 `}
      >
        {option.map((item, index) =>
          index !== selectedIndex ? (
            <div
              key={index}
              onMouseDown={() => handleSelect(index)}
              className=" grid grid-cols-2 text-right p-1 gap-2  text-xs hover:bg-surface hover:text-on-surface rounded-md items-center"
            >
              <span className="text-end">{item.text}</span>
              <FontAwesomeIcon
                icon={option[index].icon ?? icon}
                className="ml-auto"
              />
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
