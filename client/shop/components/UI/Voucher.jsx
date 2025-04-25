import { faClock, faShoppingBag } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { formattedDate } from "@util/format";
import React from "react";

const Voucher = ({ loading, voucher}) => {
  if (loading)
    return (
      <div  className="relative flex flex-row voucher h-[80px]">
        <div className="flex items-center justify-center aspect-square h-full bg-on-primary text-primary text-3xl">
          <FontAwesomeIcon icon={faShoppingBag} />
        </div>
        <div className="p-2 flex flex-col justify-around h-full overflow-x-scroll no-scrollbar whitespace-nowrap gap-2">
          <h3 className="h-5 w-[100px] rounded-lg animate-pulse bg-primary"></h3>
          <div className="h-4 w-[70px] rounded-lg animate-pulse bg-primary"></div>
          <div className="flex flex-row items-center gap-2 text-xs">
            <FontAwesomeIcon icon={faClock} />
            <div className="h-3 w-[50px] rounded-lg animate-pulse bg-primary"></div>
            <div className="h-3 w-[50px] rounded-lg animate-pulse bg-primary"></div>
          </div>
        </div>
      </div>
    );
  return (
    <div
      className={`relative h-[80px] w-full flex flex-row  items-center voucher ${
        (!voucher.is_active || new Date(voucher.valid_to) < new Date()) &&
        "opacity-30 blur-[2px]"
      }`}
    >
      <div className="flex items-center justify-center h-full aspect-square bg-on-primary grow max-w-[80px] text-primary text-3xl font-bold">
        {voucher.discount_amount}%
      </div>
      <div className="p-2 flex flex-col justify-between h-full overflow-x-scroll no-scrollbar whitespace-nowrap gap-[1px] ">
        <h3 className="text-base font-bold ">{voucher.voucher_name}</h3>
        <h4 className="opacity-60 text-xs ">{voucher.description}</h4>
        <div className="flex flex-row items-center gap-2 text-xs whitespace-normal">
          <FontAwesomeIcon icon={faClock} />
          <h5>
            {formattedDate(voucher.valid_from)} to{" "}
            {formattedDate(voucher.valid_to)}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default Voucher;
