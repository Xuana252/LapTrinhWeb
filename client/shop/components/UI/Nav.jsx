"use client";
import React, { useEffect, useState, useRef } from "react";
import ThemeButton from "@components/theme/ThemeButton";
import {
  faCartPlus,
  faCircleUser,
  faSearch,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "@node_modules/next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProfileImageHolder from "./ProfileImageHolder";
import { useSelector } from "@node_modules/react-redux/dist/react-redux";

import { useTransition, animated, useSpring } from "react-spring";

const Nav = () => {
  const session = useSelector((state) => state.session);
  const cartCount = useSelector((state) => state.cart.quantity);
  const router = useRouter();
  const searchTextRef = useRef("");
  const [isTop, setIsTop] = useState(true); // State to track if user is at the top of the page
  const navBarMobileAnimation = useSpring({
    transform: isTop ? "translateY(-1px)" : "translateY(-58px)",
    config: { easing: (t) => t * t * (3 - 2 * t) },
  });
  const navBarMobileTransition = useTransition(isTop, {
    from: {
      transform: "translateY(-100%)",
      opacity: 0,
    },
    enter: {
      transform: "translateY(-3%)",
      opacity: 1,
    },
    leave: {
      transform: "translateY(-100%)",
      opacity: 0,
    },
    config: { easing: (t) => t * t * (3 - 2 * t) },
  });

  const handleTextChange = (e) => {
    searchTextRef.current = e.target.value;
  };

  const handleSearch = () => {
    router.push(`/search?searchText=${searchTextRef.current}`);
  };

  const handleTriggerChatButton = () => {
    const chatButton = document.getElementById("chatButton");
    if (!chatButton) return;

    const mouseDownEvent = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    const mouseUpEvent = new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    chatButton.dispatchEvent(mouseDownEvent);
    chatButton.dispatchEvent(mouseUpEvent);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsTop(false);
      } else {
        setIsTop(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const cartButton = document.getElementById("CartButton");
    cartButton.classList.add("animate-bounce");
    setTimeout(() => cartButton.classList.remove("animate-bounce"), 1500);
  }, [cartCount]);

  return (
    <>
      {/* Desktop navbar */}
      <div className="hidden md:grid sticky w-full bg-secondary top-0 left-0 grid-cols-3 z-50 text-on-secondary">
        <div className="flex gap-4 items-center justify-between md:justify-start bg-secondary p-2">
          <Link href="/" className="flex flex-row gap-2 items-center">
            <Image
              src={process.env.NEXT_PUBLIC_APP_LOGO}
              alt="app logo"
              width={42}
              height={42}
            />
            <div className="font-bold text-xl">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </div>
          </Link>
          <ThemeButton />
        </div>

        <ul
          className={`hidden bg-secondary  h-full whitespace-nowrap justify-between px-2 items-center text-sm font-semibold md:row-auto row-start-3 sm:flex w-full`}
        >
          <Link
            href="/"
            className=" grow border-b-4 border-transparent  hover:border-on-secondary  h-full p-2 w-[80px]"
          >
            <button className="size-full">Home</button>
          </Link>
          <Link
            href="/search"
            className=" grow border-b-4 border-transparent  hover:border-on-secondary  h-full p-2 w-[80px]"
          >
            <button className="size-full">Product</button>
          </Link>
          <Link
            href="/about"
            className=" grow border-b-4 border-transparent  hover:border-on-secondary  h-full p-2 w-[80px]"
          >
            <button className="size-full">About us</button>
          </Link>
          <button
            className=" grow border-b-4 border-transparent  hover:border-on-secondary  h-full p-2 w-[80px]"
            onClick={handleTriggerChatButton}
          >
            Support
          </button>
        </ul>
        <ul className="flex flex-row gap-4 text-2xl justify-end bg-secondary p-2">
          <div className="rounded-full bg-primary-variant text-base flex flex-row items-center p-1">
            <input
              type="text"
              className="w-full md:w-[100px] lg:w-[300px] h-full bg-transparent  px-2 text-on-primary placeholder:text-on-primary outline-none"
              placeholder="Search product"
              onChange={handleTextChange}
              onKeyDown={(e) => {
                e.key === "Enter" ? handleSearch() : null;
              }}
            />
            <button
              onClick={handleSearch}
              className="text-xl text-surface rounded-full bg-on-surface h-full aspect-square flex items-center justify-center hover:scale-110 active:scale-95 transition-transform ease-out"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <button id="CartButton" className="relative">
            <Link href="/cart">
              <FontAwesomeIcon icon={faShoppingCart} />
            </Link>
            {cartCount > 0 && (
              <div className=" absolute size-4 rounded-full bg-primary-variant text-on-primary text-xs flex items-center justify-center font-bold top-0 left-full -translate-x-1/2">
                {cartCount}
              </div>
            )}
          </button>
          <button>
            <Link href="/account">
              <ProfileImageHolder url={session?.customer?.image} size={40} />
            </Link>
          </button>
        </ul>
      </div>

      {/* Mobile navbar */}
      <animated.div
        style={navBarMobileAnimation}
        className={`flex flex-col md:hidden sticky w-full top-0 left-0  z-50 text-on-secondary`}
      >
        <div className="bg-secondary">
        <div className="flex gap-4 items-center justify-between md:justify-start  p-2 m-0">
          <Link href="/" className="flex flex-row gap-2 items-center">
            <Image
              src={process.env.NEXT_PUBLIC_APP_LOGO}
              alt="app logo"
              width={42}
              height={42}
            />
            <div className="font-bold text-xl">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </div>
          </Link>
          <ThemeButton />
        </div>
        <ul className="flex flex-row gap-4 text-2xl justify-end p-2 m-0">
          <div className="rounded-full grow bg-primary-variant text-base flex flex-row items-center p-1">
            <input
              type="text"
              className="w-full md:w-[100px] lg:w-[300px] h-full bg-transparent  px-2 text-on-primary placeholder:text-on-primary outline-none"
              placeholder="Search product"
              onChange={handleTextChange}
              onKeyDown={(e) => {
                e.key === "Enter" ? handleSearch() : null;
              }}
            />
            <button
              onClick={handleSearch}
              className="text-xl text-surface rounded-full bg-on-surface h-full aspect-square flex items-center justify-center hover:scale-110 active:scale-95 transition-transform ease-out"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <button id="CartButton" className="relative">
            <Link href="/cart">
              <FontAwesomeIcon icon={faShoppingCart} />
            </Link>
            {cartCount > 0 && (
              <div className=" absolute size-4 rounded-full bg-primary-variant text-on-primary text-xs flex items-center justify-center font-bold top-0 left-full -translate-x-1/2">
                {cartCount}
              </div>
            )}
          </button>
          <button>
            <Link href="/account">
              <ProfileImageHolder url={session?.customer?.image} size={40} />
            </Link>
          </button>
        </ul>
        </div>
        {/* Mobile Navbar with Transition */}
        {navBarMobileTransition(
          (style, item) =>
            item && (
              <animated.div
                style={style}
                className={`flex bg-secondary h-full whitespace-nowrap justify-between items-center text-sm font-semibold row-start-3 md:hidden -z-10`}
              >
                <Link
                  href="/"
                  className="border-b-4 border-transparent  hover:border-on-secondary grow h-full p-2 w-[80px]"
                >
                  <button className="size-full">Home</button>
                </Link>
                <Link
                  href="/search"
                  className="border-b-4 border-transparent  hover:border-on-secondary grow h-full p-2 w-[80px]"
                >
                  <button className="size-full">Product</button>
                </Link>
                <Link
                  href="/about"
                  className="border-b-4 border-transparent  hover:border-on-secondary grow h-full p-2 w-[80px]"
                >
                  <button className="size-full">About us</button>
                </Link>
                <button
                  className="border-b-4 border-transparent  hover:border-on-secondary grow h-full p-2 w-[80px]"
                  onClick={handleTriggerChatButton}
                >
                  Support
                </button>
              </animated.div>
            )
        )}
      </animated.div>
    </>
  );
};

export default Nav;
