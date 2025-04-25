import { faPhone } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useState } from "react";

const SupportButton = ({ onClick, unreadMsg }) => {
  const [position, setPosition] = useState({ bottom: 20, left: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

  const handleDragStart = (e) => {
    setIsDragging(true);

    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

    setOffset({
      x: clientX - position.left,
      y: window.innerHeight - clientY - position.bottom,
    });

    setInitialPosition({ x: clientX, y: clientY });
  };

  const handleDragMove = (e) => {
    if (isDragging) {
      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

      // Calculate new position
      const newBottom = window.innerHeight - clientY - offset.y;
      const newLeft = clientX - offset.x;

      // Ensure the button stays within the viewport
      const clampedBottom = Math.max(
        0,
        Math.min(newBottom, window.innerHeight - 50)
      ); // Keep it above the bottom edge
      const clampedLeft = Math.max(
        0,
        Math.min(newLeft, window.innerWidth - 50)
      ); // Keep it within the left edge

      setPosition({
        bottom: clampedBottom,
        left: clampedLeft,
      });
    }
  };

  const handleDragEnd = (e) => {
    const clientX =
      e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
    const clientY =
      e.type === "touchend" ? e.changedTouches[0].clientY : e.clientY;

    if (clientX === initialPosition.x && clientY === initialPosition.y) {
      onClick();
    }

    setIsDragging(false);
    setInitialPosition({ x: 0, y: 0 });
  };

  return (
    <button
      id="chatButton"
      className={` shadow-xl fixed size-9 m-4 rounded-full bg-on-primary text-primary sm:scale-110 transition-transform duration-150 hover:scale-150 z-50 ${
        unreadMsg > 0 ? `animate-bounce` : ""
      }`}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      style={{
        bottom: `${position.bottom}px`,
        left: `${position.left}px`,
        position: "fixed",
        cursor: "pointer",
      }}
    >
      {unreadMsg > 0 && (
        <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 size-4 text-xs sm:text-sm rounded-full bg-primary text-on-primary font-semibold flex items-center justify-center">
          {unreadMsg}
        </div>
      )}
      <FontAwesomeIcon icon={faPhone} size="lg" />
    </button>
  );
};

export default SupportButton;
