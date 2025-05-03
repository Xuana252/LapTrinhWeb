import React, { useEffect, useRef } from "react";

const InputArea = ({ value, onTextChange, placeholder = "" }) => {
  const textareaRef = useRef(null);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // reset first
      textarea.style.height = textarea.scrollHeight + "px"; // set to new height
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [value]); // run on value change

  return (
    <textarea
      ref={textareaRef}
      value={value}
      className="resize-none bg-primary text-on-primary rounded-lg text-base outline-none p-2 w-full min-h-fit"
      autoComplete="off"
      placeholder={placeholder}
      onChange={(e) => {
        onTextChange(e);
        resizeTextarea();
      }}
    />
  );
};

export default InputArea;
