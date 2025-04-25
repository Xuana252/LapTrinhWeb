import React, { useEffect, useRef, useState } from "react";

const CollapsibleContainer = ({ content, maxHeight }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current.scrollHeight > maxHeight) setIsExpandable(true);
  }, [maxHeight]);
  return (
    <div className="w-full h-fit relative">
        <div
        ref={containerRef}
        className={`w-full overflow-y-hidden ${isExpanded ? 'h-fit' : ''}`}
        style={{ maxHeight: isExpanded ? 'none' : maxHeight }}
        >
          {content}
        </div>
        {isExpandable && (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className={` hover:font-bold text-center w-full bottom-0 ${isExpanded?'':'bg-gradient-to-b  absolute'} from-transparent to-surface  text-on-surface `}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      )}
    </div>
  );
};

export default CollapsibleContainer;
