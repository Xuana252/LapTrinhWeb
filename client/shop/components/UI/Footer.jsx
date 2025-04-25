"use client";
import {
  faFacebook,
  faFacebookSquare,
  faGithub,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAllCategory } from "@service/category";

const Footer = () => {
  const [categories, setCategories] = useState([]);

  const toastMessage = () => {
    alert("Sorry we're currently working on this feature");
  }
  const fetchCategories = () => {
    getAllCategory().then((data) => setCategories(data));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="h-fit w-full bg-secondary text-on-secondary flex sm:flex-row gap-4 flex-col px-10 md:px-20 py-10">
      <div className="flex sm:flex-row flex-col gap-10 grow">
        <div className="flex flex-col gap-2">
          <span className="font-bold">Products</span>
          <ul className="flex sm:flex-col gap-1 text-sm text-on-secondary/50 ">
            {categories?.slice(0, 5).map((item) => (
              <li
                key={item.category_id}
                className="hover:text-on-secondary cursor-pointer"
              >
                <Link href={`/search?category=${item.category_id}`}>
                  {item.category_name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Services</span>
          <ul className="flex sm:flex-col gap-1 text-sm text-on-secondary/50">
            <li className="hover:text-on-secondary cursor-pointer">
            <Link href="https://github.com/22521518/SE100.TechStore" target="_blank">
              Contact us
            </Link>
            </li>
            <li className="hover:text-on-secondary cursor-pointer">
              <Link href="/tracking">Order tracking</Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Our company</span>
          <ul className="flex sm:flex-col gap-1 text-sm text-on-secondary/50">
            <li className="hover:text-on-secondary cursor-pointer">
              <Link href="/about">About us</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-end">
        <ul className=" flex flex-row items-start gap-4 text-xl grow">
          <button onClick={()=>toastMessage()}>
            <FontAwesomeIcon icon={faEnvelope} />
          </button>
          <button onClick={()=>toastMessage()}>
            <FontAwesomeIcon icon={faFacebookSquare} />
          </button>
          <button onClick={()=>toastMessage()}>
            <FontAwesomeIcon icon={faYoutube} />
          </button>
          <button>
            <Link href="https://github.com/22521518/SE100.TechStore" target="_blank">
              <FontAwesomeIcon icon={faGithub} />
            </Link>
          </button>
        </ul>
        <span className="font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</span>
        <div>&copy; MADE BY NHÓM 7 </div>
      </div>
    </div>
  );
};

export default Footer;
