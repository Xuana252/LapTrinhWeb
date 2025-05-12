"use client";

import ProfileImageHolder from "@components/UI/ProfileImageHolder";
import {
  formattedDate,
  formattedDateTime,
  formattedFullDate,
} from "@util/format";
import React, { useMemo } from "react";

const RoomCard = ({ room, loading }) => {

  if (loading) {
    return (
      <div className="rounded cursor-pointer bg-secondary/50 hover:bg-secondary/60 active:bg-secondary/80 text-on-secondary w-full gap-2 p-1 grid grid-cols-[auto_1fr_auto] animate-pulse">
        <div className="bg-on-surface/50 animate-pulse rounded-full w-[46px] h-[46px]" />
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-on-surface/50 animate-pulse rounded w-3/4" />
          <div className="h-3 bg-on-surface/50 animate-pulse rounded w-1/2" />
          <div className="h-3 bg-on-surface/50 animate-pulse rounded w-full" />
        </div>
        <div className="flex flex-col items-end justify-between">
          <div className="bg-on-surface/50 animate-pulse rounded-full w-4 h-4" />
          <div className="h-3 bg-on-surface/50 animate-pulse rounded w-12" />
        </div>
      </div>
    );
  }
  return (
    <div className={` transition-all duration-200 ease-in-out rounded  cursor-pointer bg-secondary/50 hover:bg-secondary/60 active:bg-secondary/80 text-on-secondary w-full gap-2 p-2 items-center grid grid-cols-[auto_1fr_auto]`}>
      <div className={`${room.online?"outline outline-2 outline-green-500":""} rounded-full`}>
          <ProfileImageHolder url={room.customer.image} size={46} />
      </div>
      <div className="flex flex-col gap-1 overflow-hidden text-ellipsis">
        <div className="flex flex-col text-left">
          <span className="font-semibold text-sm">
            {room.customer.username}
          </span>
          <span className="text-xs opacity-50">{room.customer.email}</span>
        </div>
        <span className="text-sm w-full truncate overflow-hidden whitespace-nowrap">
          {room.lastMessage ? room.lastMessage.message : "new chat"}
        </span>
      </div>
      <div className="flex flex-col h-full items-end justify-between text-right">
        <div
          className={`${
            room.adminRead ? "size-0" : "size-2"
          } bg-red-500 rounded-full`}
        ></div>

        <span className="text-xs opacity-50">
          {formattedDateTime(room.updatedAt)}
        </span>
      </div>
    </div>
  );
};

export default RoomCard;
