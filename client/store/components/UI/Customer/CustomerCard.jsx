import React from "react";
import ProfileImageHolder from "../ProfileImageHolder";

const CustomerCard = ({ customer, loading }) => {
    if(loading) 
        return (
    <div className="flex flex-col rounded bg-surface p-2 shadow-md">

    </div>
    )
  return (
    <div className="flex flex-col rounded bg-surface shadow-md p-2">
      <div className="flex flex-row gap-2 items-center">
        <ProfileImageHolder url={customer?.image} size={32} />

        <div className="grow flex flex-row justify-between items-center">
          <div>{customer.username}</div>
          <div>{customer.email}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
