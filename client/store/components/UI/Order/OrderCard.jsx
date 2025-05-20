import Link from "@node_modules/next/link";
import ProfileImageHolder from "../ProfileImageHolder";
import { getCustomer } from "@service/customer";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faCalendar,
  faClock,
  faMoneyBill,
  faQuestion,
  faSpinner,
  faTimesCircle,
  faTruck,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { formattedDate, formattedPrice } from "@util/format";

const OrderCard = ({ order, loading }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-500 bg-yellow-100";
      case "processing":
        return "text-blue-500 bg-blue-100";
      case "shipped":
        return "text-purple-500 bg-purple-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-500 bg-red-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return faClock;
      case "processing":
        return faSpinner;
      case "shipped":
        return faTruck;
      case "delivered":
        return faBoxOpen;
      case "cancelled":
        return faTimesCircle;
      default:
        return faQuestion;
    }
  };
  if (loading)
    return (
      <div>
        <div className="flex flex-col rounded bg-surface p-2 shadow-md gap-2">
          <div className=" w-full flex flex-wrap gap-2 items-center">
            <div className="h-[32px] grow rounded bg-on-surface/20 animate-pulse"></div>
            <div className="grow h-[32px] rounded bg-on-surface/20 animate-pulse"></div>
          </div>
          <div className="rounded bg-on-surface/20 animate-pulse w-full h-[30px]"></div>
        </div>
      </div>
    );
  return (
    <Link
      href={`orders/${order._id}`}
      className="flex flex-col rounded bg-surface/60 hover:bg-surface shadow-md p-2 gap-4"
    >
      <div className="flex gap-2 items-center">
        <div className="grow flex gap-1 justify-between items-center">
          <div className="flex flex-wrap gap-2  panel-3">
            <ProfileImageHolder url={order?.user_id?.image} size={32} />
            <div className="flex flex-col gap-1 items-start">
              <div className="font-bold">{order?.user_id?.username}</div>
              <div className="text-xs opacity-70">{order?.user_id?.email}</div>
              <div className="text-xs ">{order?.user_id?.phone_number}</div>
            </div>
          </div>

          <div className="text-end text-sm opacity-70 space-y-2">
            <div>{order._id}</div>
            <div>
              <FontAwesomeIcon icon={faCalendar} />{" "}
              {formattedDate(order.createdAt)}
            </div>
            <div>{order.order_item.length} items</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 panel-2">
        <div
          className={`font-semibold px-2 py-1 rounded ${getStatusColor(
            order.order_status
          )}`}
        >
          <FontAwesomeIcon icon={getStatusIcon(order.order_status)} />{" "}
          {order.order_status}
        </div>
        <div className="text-green-500 font font-semibold">
          <FontAwesomeIcon icon={faMoneyBill} />{" "}
          {formattedPrice(order.total_price)}
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
