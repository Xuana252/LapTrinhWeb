"use client"; // Ensure this is a Client Component

import { faSun, faMoon, faCircleHalfStroke, faLightbulb } from "@fortawesome/free-solid-svg-icons"; // Import both icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { changeTheme, getStoredTheme } from "./ThemeProvider";

const ThemeButton = () => {

  const handleChangeTheme = () => {
    changeTheme()
  }

  return (
    <button onClick={handleChangeTheme} className="rounded-full text-xl bg-on-primary text-primary hover:bg-on-primary/90 size-9 flex items-center justify-center hover:animate-pulse">
      <FontAwesomeIcon icon={faLightbulb} />
      {/* Change icon based on the current theme */}
    </button>
  );
};

export default ThemeButton;
