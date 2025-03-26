"use client";
import {
  faBox,
  faKey,
  faLocationDot,
  faTicket,
  faUser,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, useSession } from "@node_modules/next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import ProfileImageHolder from "./ProfileImageHolder";
import { useDispatch, useSelector } from "@node_modules/react-redux/dist/react-redux";
import { clearOrder, setOrderStateAsync } from "@provider/redux/order/orderSlice";

const AccountPageNav = () => {
  const session = useSelector((state)=>state.session)
  const dispatch = useDispatch()
  const pathName = usePathname();
  const MenuItems = [
    { name: "My account", path: "/account", icon: faUser },
    { name: "Address", path: "/account/address", icon: faLocationDot },
    { name: "Change password", path: "/account/changePassword", icon: faKey },
    { name: "Orders", path: "/account/orders", icon: faBox },
    { name: "Vouchers", path: "/account/vouchers", icon: faTicket },
  ];

  const handleSignOut = async () => {
        dispatch(clearOrder());
        await dispatch(setOrderStateAsync(0)); // Reset Redux state
        signOut()
  }
  
  return (
    <div className="grid grid-rows-[auto_1fr] gap-2 w-full">
      <div className="flex flex-row w-full gap-4 items-center">
        <button className="text-4xl">
          <ProfileImageHolder url={session?.customer?.image} size={40}/>
        </button>
        <div className="flex flex-col h-full justify-between">
          <span className="text-xl">{session?.customer?.username}</span>
          <span onClick={handleSignOut} className="text-sm opacity-50 hover:opacity-100 cursor-pointer w-fit text-red-500 font-bold underline">Log out</span>
        </div>
      </div>
      <div className="  panel-1 ">
        <div className="overflow-x-scroll no-scrollbar w-full flex flex-row md:flex-col gap-2 text-sm items-center md:items-start ">
          {MenuItems.map((item) => (
            <Link key={item.name} href={item.path} className="w-full">
              <button
                className={`whitespace-nowrap ${
                  pathName === item.path
                    ? "account-nav-bar-selected-item"
                    : "account-nav-bar-item"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.name}</span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountPageNav;
