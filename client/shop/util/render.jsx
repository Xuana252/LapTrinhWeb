import { faMoneyBill } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import Image from "@node_modules/next/image";

export const renderPaymentMethod = (method) => {
  switch (method) {
    case "momo":
      return (
        <Image
          src={"/images/MoMo_Logo.png"}
          alt="MOMO"
          width={32}
          height={32}
          className="rounded"
        />
      );
    case "zalo":
      return (
        <Image
          src={"/images/ZaloPay_Logo.png"}
          alt="MOMO"
          width={32}
          height={32}
          className="rounded"
        />
      );
    case "cod":
      return (
        <div className="flex flex-row items-center gap-2 text-xl rounded bg-black/50 px-2 py-1  text-white">
          <FontAwesomeIcon icon={faMoneyBill} />
        </div>
      );
    default:
      return null;
  }
};
export const renderStatus = (status) => {
  switch (status) {
    case "pending":
      return <div className="pending">{status}</div>;
    case "shipped":
      return <div className="shipped">{status}</div>;
    case "delivered":
      return <div className="delivered">{status}</div>;
    case "cancelled":
      return <div className="cancelled">{status}</div>;
    case "confirmed":
      return <div className="confirmed">{status}</div>;
  }
};
