"use client";
import OrderSection from "@components/dashboardSection/OrderSection";
import FilterButton from "@components/Input/FilterButton";
import Pagination from "@components/UI/Layout/Pagination";
import OrderCard from "@components/UI/Order/OrderCard";
import {
  faBox,
  faSearch,
  faSort,
  faCalendar,
  faArrowDownAZ,
  faArrowUpAZ,
  faMoneyBill,
  faSortNumericDesc,
  faSortNumericAsc,
  faLi,
  faList,
  faClock,
  faSpinner,
  faTruck,
  faBoxOpen,
  faTimesCircle,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { getAllOrder } from "@service/order";
import { useEffect, useState } from "react";

const Order = () => {
  const ORDER_LIMIT = 18;

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [dateSort, setDateSort] = useState(0);
  const [revenueSort, setRevenueSort] = useState(0);
  const [orderStatus, setOrderStatus] = useState("");

  const [pendingText, setPendingText] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    setSearchText(pendingText);
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    getAllOrder(page, ORDER_LIMIT, searchText, dateSort, revenueSort,orderStatus)
      .then((res) => {
        setOrders(res.orders);
        setCount(res.count);
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => setIsLoading(false), 1000);
  };

  useEffect(() => {
    fetchOrders();
  }, [dateSort, revenueSort, page,orderStatus,searchText]);

  useEffect(() => {
    setPage(1);
  }, [searchText,orderStatus]);

  return (
    <div className="gap-4 flex flex-col">
      <div className="title">
        <FontAwesomeIcon icon={faBox} /> Orders
      </div>
      <OrderSection />
      {/* search */}
      <div className="panel-3">
        <div className="w-full rounded-full grow bg-primary-variant p-1 flex">
          <input
            type="text"
            className="w-full rounded-full px-2 bg-transparent text-on-primary placeholder:text-on-primary outline-none"
            placeholder="Search username, email"
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
      <div className="flex bg-surface bg-opacity-50 py-2 px-4 rounded-xl gap-4 panel-3 items-center">
        <h2 className="text-white font-bold text-lg">{count} orders</h2>
        <div className="flex justify-center ml-auto gap-4 panel-3">
          <FilterButton
            name={"Order Status"}
            icon={faSort}
            option={[
              { text: "All", value: "", icon: faList },
              { text: "Pending", value: "pending", icon: faClock },
              { text: "Processing", value: "processing", icon: faSpinner },
              { text: "Shipped", value: "shipped", icon: faTruck },
              { text: "Delivered", value: "delivered", icon: faBoxOpen },
              { text: "Cancelled", value: "cancelled", icon: faTimesCircle },
            ]}
            onChange={setOrderStatus}
          />
          <FilterButton
            name={"Create Date"}
            icon={faSort}
            option={[
              { text: "All", value: 0, icon: faCalendar },
              { text: "Oldest", value: -1, icon: faArrowDownAZ },
              { text: "Latest", value: 1, icon: faArrowUpAZ },
            ]}
            onChange={setDateSort}
          />
          <FilterButton
            name={"Total Price"}
            icon={faSort}
            option={[
              { text: "All", value: 0, icon: faMoneyBill },
              { text: "Desc", value: 1, icon: faSortNumericDesc },
              { text: "Asc", value: -1, icon: faSortNumericAsc },
            ]}
            onChange={setRevenueSort}
          />
        </div>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 overflow-visible">
        {isLoading
          ? Array.from({ length: ORDER_LIMIT }).map((_, index) => (
              <OrderCard key={index} loading={true} />
            ))
          : orders
              .slice((page - 1) * ORDER_LIMIT, page * ORDER_LIMIT)
              ?.map((item) => <OrderCard key={item._id} order={item} />)}
      </ul>
      <Pagination
        limit={ORDER_LIMIT}
        current={page}
        count={count}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Order;
