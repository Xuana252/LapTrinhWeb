"use client";
import CustomerFeedbacksTab from "@components/UI/Customer/CustomerFeedbacksTab";
import CustomerOrdersTab from "@components/UI/Customer/CustomerOrderTab";
import CustomerRevenueTab from "@components/UI/Customer/CustomerRevenueTab";
import ProfileImageHolder from "@components/UI/ProfileImageHolder";
import {
  faAt,
  faBan,
  faCableCar,
  faCalendar,
  faIdBadge,
  faPhone,
  faSpinner,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useParams } from "@node_modules/next/navigation";
import { banCustomer, getCustomer } from "@service/customer";
import { formattedDate } from "@util/format";
import { toastError, toastRequest, toastSuccess } from "@util/toaster";
import { useEffect, useState } from "react";

const UserInfo = () => {
  const params = useParams();
  const [customer, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const handleBan = async () => {
    const result = await toastRequest(
      `Do you want to ${customer?.is_active ? "ban" : "unban"} this customer`
    );
    if (result) {
      setIsLoading(true);
      banCustomer(customer._id).then((res) => {
        if (res) {
          toastSuccess(`Customer ${customer?.is_active ? "ban" : "unban"}ned`);
          setUser((prev) => ({ ...prev, is_active: !prev.is_active }));
        } else {
          toastError(
            `Failed to  ${customer?.is_active ? "ban" : "unban"} customer`
          );
        }
      });
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const fetchUser = () => {
    setIsLoading(true);
    getCustomer(params.id)
      .then((res) => {
        setUser(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => setIsLoading(false), 1000);
  };

  useEffect(() => {
    fetchUser();
  }, [params.id]);
  return (
    <section className="size-full h-fit flex flex-col items-center gap-4 overflow-visible">
      <div className="flex flex-wrap panel-3 w-full justify-end">
        <button
          onClick={handleBan}
          className="bg-red-500  text-white p-1 rounded active:opacity-80 transition-colors duration-200 ease-out gap-2 flex items-center justify-center h-fit"
        >
          {" "}
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : (
            <>
              {customer?.is_active ? "Ban" : "Unban"}
              <FontAwesomeIcon icon={faBan} />
            </>
          )}
        </button>
      </div>
      <div className="rounded panel-2 w-full p-2 gap-4 flex flex-wrap justify-center items-center">
        <ProfileImageHolder url={customer?.image} size={128} />

        <div className="flex flex-col gap-2 grow">
          <div className=" grow flex flex-wrap gap-2 items-center justify-evenly panel-4">
            <span className="font-semibold text-2xl">
              <FontAwesomeIcon icon={faIdBadge} /> {customer?.username}
            </span>
            <span className="">
              <FontAwesomeIcon icon={faAt} /> {customer?.email}
            </span>
            <span className="">
              <FontAwesomeIcon icon={faPhone} /> {customer?.phone_number}
            </span>
          </div>
          <div className="panel-4 text-right flex items-center justify-between gap-2">
            <span>
              <FontAwesomeIcon icon={faCalendar} />{" "}
              {formattedDate(customer?.createdAt)}
            </span>
            <span
              className={`size-3 rounded-full ${
                customer?.is_active ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <CustomerRevenueTab id={params.id} />
      </div>

      <div className="flex flex-wrap gap-4 w-full">
        <div className="grow overflow-hidden">
          <CustomerOrdersTab id={params.id} />
        </div>
        <div className="grow overflow-hidden">
          <CustomerFeedbacksTab id={params.id} />
        </div>
      </div>
    </section>
  );
};

export default UserInfo;
