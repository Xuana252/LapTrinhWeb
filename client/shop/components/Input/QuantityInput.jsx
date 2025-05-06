import {
  faMinus,
  faPlus,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useReducer, useRef } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return {
        quantity: Math.min(state.quantity + 1, action.max),
      };
    case "decrement":
      return {
        quantity: Math.max(state.quantity - 1, action.min),
      };
    case "change":
      return {
        quantity: Math.min(Math.max(action.value, 0), action.max),
      };
    default:
      return state;
  }
}

const QuantityInput = ({ min = 1, max, onChange ,value = 1 }) => {
  const [state, dispatch] = useReducer(reducer, {
    quantity: value,
  });

  useEffect(() => {
    if (onChange) onChange(state.quantity);
  }, [state.quantity]);

  

  return (
    <div className="text-xs  md:text-base shadow rounded border-2 border-on-background/20  w-fit text-on-surface grid grid-cols-[auto_1fr_auto] mt-auto">
      <button
        className="p-2 shadow flex items-center justify-center hover:scale-105 active:scale-95"
        onClick={() => dispatch({ type: "decrement", min })}
      >
        <FontAwesomeIcon icon={faMinus} />
      </button>
      <input
        type="number"
        value={value}
        style={{
          appearance: "textfield",
          MozAppearance: "textfield",
          WebkitAppearance: "none",
        }}
        min={1}
        max={max}
        onChange={(e) => {
          const rawValue = e.target.value;
          // Only accept digits
          if (!/^\d*$/.test(rawValue)) return;

          const parsed = parseInt(rawValue);
          if (!parsed) {
            // Fallback to 1 if input is empty or invalid
            dispatch({ type: "change", value: 0, max });
          } else {
            dispatch({ type: "change", value: parsed, max });
          }
        }}
        className=" font-bold flex items-center justify-center bg-transparent outline-none text-center w-fit"
      ></input>
      <button
        className="p-2 flex shadow  items-center justify-center hover:scale-105 active:scale-95"
        onClick={() => dispatch({ type: "increment", max })}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
};

export default QuantityInput;
