import React, { useState } from "react";

const PriceInput = ({ value, onChange }) => {
  
    const [displayValue, setDisplayValue] = useState(formatPrice(value));

    function formatPrice(val) {
      return val.toLocaleString("vi-VN");
    }
  
    function unformatPrice(str) {
      return parseInt(str.replace(/[^\d]/g, ""), 10) || 0;
    }
  
    const handleChange = (e) => {
      const raw = e.target.value;
      const unformatted = unformatPrice(raw);
  
      if (onChange) onChange(unformatted);
      setDisplayValue(formatPrice(unformatted));
    };
  return (
    <input
      type="text"
      value={displayValue}
      inputMode="numeric"
      onChange={handleChange}
      className="h-7 text-base font-bold shadow-md rounded bg-secondary text-on-secondary outline-none text-center w-28"
      style={{
        appearance: "textfield",
        MozAppearance: "textfield",
        WebkitAppearance: "none",
      }}
    />
  );
};

export default PriceInput;
