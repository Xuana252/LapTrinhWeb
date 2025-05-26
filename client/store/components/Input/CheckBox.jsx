import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";

const CheckBox = ({ onChecked, onUnchecked , checked=false }) => {
  const [isChecked, setIsChecked] = useState(checked);
  const handleClick = (e) => {
    e.preventDefault();
    setIsChecked((prev) => !prev);
  };

  useEffect(() => {
    if (isChecked) {
      onChecked();
    } else {
      onUnchecked();
    }
  }, [isChecked]);

  useEffect(() => {
    setIsChecked(checked)
  }, [checked]);

  return (
    <button
      className={`${isChecked?'border-on-background':'border-on-background/50'} border-2  size-4 outline-none size-xs flex items-center justify-center transition-colors duration-200`}
      onClick={handleClick}
    >
      <FontAwesomeIcon
        icon={faCheck}
        className={`${
          isChecked ? "scale-100" : "scale-0"
        } transition-transform origin-center duration-200`}
      />
    </button>
  );
};

export default CheckBox;
