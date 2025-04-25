"use client";
import InputBox from "@components/Input/InputBox";
import Divider from "@components/UI/Divider";
import Voucher from "@components/UI/Voucher";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faShoppingBag, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "@node_modules/next-auth/react";
import { useSelector } from "@node_modules/react-redux/dist/react-redux";
import { getVouchers } from "@service/voucher";
import { formattedDate } from "@util/format";
import React, { useEffect, useState } from "react";

const Vouchers = () => {
  const session = useSelector((state) => state.session);
  const [isLoading, setIsLoading] = useState(true);
  const [vouchers, setVouchers] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const fetchVoucher = () => {
    setIsLoading(true);
    getVouchers(session?.user?.id).then((data) => {
      // Separate vouchers into two groups
      const activeAndValidVouchers = data.filter(
        (voucher) =>
          voucher.is_active && new Date(voucher.valid_to) >= new Date() // Active and not expired
      );

      const expiredVouchers = data.filter(
        (voucher) =>
          !voucher.is_active || new Date(voucher.valid_to) < new Date() // Inactive or expired by date
      );

      // Sort active & valid vouchers by expiration date (ascending)
      const sortedValidVouchers = activeAndValidVouchers.sort(
        (a, b) => new Date(a.valid_to) - new Date(b.valid_to)
      );

      // Sort expired vouchers by expiration date (descending)
      const sortedExpiredVouchers = expiredVouchers.sort(
        (a, b) => new Date(b.valid_to) - new Date(a.valid_to)
      );

      // Combine the sorted arrays: valid vouchers first, expired vouchers second
      const sortedVouchers = [...sortedValidVouchers, ...sortedExpiredVouchers];
      setVouchers(sortedVouchers);
    });

    setTimeout(() => setIsLoading(false), 1000);
  };
  useEffect(() => {
    fetchVoucher();
  }, []);
  return (
    <section className="w-full flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold">Electro vouchers</div>
        <div className="text-sm opacity-60">See our vouchers </div>
      </div>
      <Divider />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-on-surface/20 p-2">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Voucher key={index} loading={true} />
            ))
          : vouchers.map((voucher) => (
            <Voucher key={voucher.voucher_code} voucher={voucher}/>
            ))}
      </div>
    </section>
  );
};

export default Vouchers;
