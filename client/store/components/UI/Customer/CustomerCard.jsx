import React from "react";
import ProfileImageHolder from "../ProfileImageHolder";
import { formattedDate, formattedPrice } from "@util/format";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  faCalendar,
  faMoneyBill,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import Link from "@node_modules/next/link";

const CustomerCard = ({ customer, loading }) => {
  if (loading)
    return (
      <div className="flex flex-col rounded bg-surface p-2 shadow-md gap-2">
        <div className=" w-full flex flex-wrap gap-2 items-center">
          <div className="size-[32px] rounded-full bg-on-surface/20 animate-pulse"></div>
          <div className="grow h-[16px] rounded bg-on-surface/20 animate-pulse"></div>
        </div>
        <div className="rounded bg-on-surface/20 animate-pulse w-full h-[30px]"></div>
      </div>
    );
  return (
    <Link href={`users/${customer._id}`} className="flex flex-col rounded bg-surface/60 hover:bg-surface shadow-md p-2 gap-4">
      <div className="flex flex-row gap-2 items-center ">
        <ProfileImageHolder url={customer?.image} size={32} />

        <div className="grow flex flex-wrap justify-between items-center">
          <div className="font-bold">{customer.username}</div>
          <div className="flex flex-col gap-2 items-end">
            <div className="text-sm opacity-70">{customer.email}</div>
            <div className="text-sm opacity-70">{customer.phone_number}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 panel-2">
        <span className="italic text-xs opacity-50">
          <FontAwesomeIcon icon={faCalendar} />{" "}
          {formattedDate(customer.createdAt)}
        </span>
        <span className={`${customer.is_active?"bg-green-500":"bg-red-500"} size-3 rounded-full`}>
        </span>
      </div>
    </Link>
  );
};

export default CustomerCard;
