import React from "react";

const InputArea = ({value,onTextChange,placeholder=""}) => {
  return (
    <textarea
      value={value}
      className=" resize-none bg-primary text-on-primary rounded-lg text-base outline-none p-2 w-full h-[150px]"
      autoComplete="off"
      placeholder={placeholder}
      onChange={onTextChange}
    />
  );
};

export default InputArea;
