"use client";
import ThemeButton from "@components/theme/ThemeButton";
import {
  faAngleLeft,
  faAngleRight,
  faChartBar,
  faChartSimple,
  faGear,
  faGripLines,
  faKey,
  faUser,
  faUserGear,
  faUserLock,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, useSession } from "@node_modules/next-auth/react";
import Image from "@node_modules/next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { createContext, ReactNode, useEffect, useState } from "react";

export default function SideBar({ menu, children }) {
  const pathName = usePathname();

  const [isMinimize, setIsMinimize] = useState(false);

  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Handle touch start
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  // Handle touch move
  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  // Handle touch end (detect swipe direction)
  const handleTouchEnd = () => {
    if (touchStartX < touchEndX - 50 && touchStartX < 50) {
      setIsMinimize(false);
    } else if (touchEndX < touchStartX - 50) {
      setIsMinimize(true);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMinimize(window.innerWidth < 720);
    };

    // Set initial window dimensions
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="grid sm:grid-cols-[auto_1fr] grid-cols-[1fr] text-accent h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`Side_bar_menu w-fit transition-transform duration-200 absolute sm:static left-0 h-screen ${
          isMinimize ? "-translate-x-[100%] sm:translate-x-0" : "translate-x-0"
        }`}
      >
        <div className="flex flex-row items-center justify-between  bg-primary p-2 rounded-md gap-2">
          <div className="flex flex-row gap-2 items-center">
            <Image
              src={process.env.NEXT_PUBLIC_APP_LOGO}
              alt="app logo"
              width={32}
              height={32}
            />
            <div className="font-bold text-md">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </div>
          </div>
          <ThemeButton />
        </div>
        <div className="Side_bar_path_list">
          {menu.map((section, sectionIndex) => (
            <ul
              key={sectionIndex}
              className="Side_bar_section transition-all duration-200 ease-in-out"
            >
              <li className="text-accent/50 text-sm">{section.section}</li>
              <hr className="border-none bg-primary h-[1px]" />
              {section.items.map((item, index) => (
                <div className="w-full" key={index}>
                  <Link
                    href={item.path}
                    className={`${
                      item.path === pathName
                        ? "Side_bar_selected_item"
                        : "Side_bar_item"
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                    {item.name}
                  </Link>
                </div>
              ))}
            </ul>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-2 items-center justify-end w-full ">
          <div className="flex flex-row gap-2 items-center justify-between w-full">
            <div className="rounded-full size-9 bg-on-surface text-secondary p-1 text-xl items-center justify-center flex">
              <FontAwesomeIcon icon={faUserTie} />
            </div>

            <button onClick={() => signOut()} className="text-red-500 font-bold underline w-fit text-sm">
              Sign out
            </button>
          </div>
          <button
            className="w-full rounded-lg bg-surface/50 text-on-surface hover:bg-secondary-1 sm:hidden"
            onClick={() => setIsMinimize(true)}
          >
            <FontAwesomeIcon icon={faGripLines} />
          </button>
        </div>
      </div>

      <div className="overflow-y-scroll p-2 overflow-x-hidden z-30 relative">
        {children}
      </div>

      <button
        className={`${
          isMinimize ? "button-variant-1" : "hidden"
        } hover:opacity-100 opacity-50 z-40 fixed bottom-[10px] left-[10px]  `}
        onClick={() => setIsMinimize(false)}
      >
        <FontAwesomeIcon icon={faGripLines} />
      </button>
    </div>
  );
}
