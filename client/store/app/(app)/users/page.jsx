"use client";
import UsersSection from "@components/dashboardSection/UsersSection";
import FilterButton from "@components/Input/FilterButton";
import InputBox from "@components/Input/InputBox";
import CustomerCard from "@components/UI/Customer/CustomerCard";
import Pagination from "@components/UI/Layout/Pagination";
import ProductCard from "@components/UI/Product/ProductCard";
import { text } from "@node_modules/@fortawesome/fontawesome-svg-core";
import {
  faAdd,
  faAngleLeft,
  faAngleRight,
  faArrowDownAZ,
  faArrowUpAZ,
  faBox,
  faCalendar,
  faMoneyBill,
  faSearch,
  faSort,
  faSortAlphaAsc,
  faSortAlphaDesc,
  faSortNumericAsc,
  faSortNumericDesc,
  faStar,
  faTag,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import Link from "@node_modules/next/link";
import { getAllCustomers } from "@service/customer";
import React, { useEffect, useState } from "react";

const User = () => {
  const USER_LIMIT = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const [pendingText, setPendingText] = useState("");
  const [searchText, setSearchText] = useState("");

  const [dateSort, setDateSort] = useState(-1);
  const [banFilter, setBanFilter] = useState(0);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    setSearchText(pendingText);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    getAllCustomers(USER_LIMIT, page, searchText, dateSort, banFilter)
      .then((res) => {
        setUsers(res.users);
        setCount(res.count);
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => setIsLoading(false), 1000);
  };

  useEffect(() => {
    fetchUsers();
  }, [dateSort, page,banFilter,searchText, searchText]);

  useEffect(() => {
    setPage(1);
  }, [searchText,banFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="title">
        <FontAwesomeIcon icon={faBox} /> Users
      </div>
      <UsersSection />
      <div className="panel-3">
        <div className="rounded-full grow bg-primary-variant text-base flex flex-row items-center p-1">
          <input
            type="text"
            className="grow h-full bg-transparent  px-2 text-on-primary placeholder:text-on-primary outline-none"
            placeholder="Search user"
            onChange={(e) => setPendingText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSearch}
            className="text-xl text-surface rounded-full bg-on-surface h-full aspect-square flex items-center justify-center p-1"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>
      {/* filter */}
      <div className="flex-wrap-reverse gap-4 flex items-center justify-end h-fit shadow-lg rounded-xl w-full bg-surface py-2 px-4 panel-3">
        <h2 className="text-lg mr-auto font-bold">{count} results</h2>
        <div className="flex flex-wrap gap-4 panel-3">
          <FilterButton
            name={"join date"}
            icon={faSort}
            option={[
              { text: "Latest", value: -1, icon: faArrowUpAZ },
              { text: "Oldest", value: 1, icon: faArrowDownAZ },
            ]}
            onChange={setDateSort}
          />
          <FilterButton
            name={"active"}
            icon={faSort}
            option={[
              { text: "All", value: 0, icon: faMoneyBill },
              { text: "Banned", value: -1, icon: faSortNumericDesc },
              { text: "Active", value: 1, icon: faSortNumericAsc },
            ]}
            onChange={setBanFilter}
          />
        </div>
      </div>
      {/* users list */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 overflow-visible">
        {isLoading
          ? Array.from({ length: USER_LIMIT }).map((_, index) => (
              <CustomerCard key={index} loading={true} />
            ))
          : users?.map((item) => (
              <CustomerCard key={item._id} customer={item} />
            ))}
      </ul>
      {/* page selector */}
      <Pagination
        limit={USER_LIMIT}
        count={count}
        current={page}
        onPageChange={setPage}
      />
    </div>
  );
};

export default User;
