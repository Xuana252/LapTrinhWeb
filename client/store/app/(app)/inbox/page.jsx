"use client";
import ChatList from "@components/Chat/ChatList";
import MessageBox from "@components/Chat/MessageBox";
import React, { useEffect, useState } from "react";

const Inbox = () => {
  const [room, setRoom] = useState(null);

  const handleSelectRoom = (room) => {
    setRoom((prev) => room);
  };

  return (
    <div className="h-full w-full flex gap-2">
      <div className={`${room ? "" : "hidden md:inline-block"} grow`}>
        <MessageBox room={room} onSelect={handleSelectRoom} />
      </div>
      <div
        className={`${
          room ? "hidden md:inline-block  " : " "
        } grow  md:max-w-[40%] `}
      >
        <ChatList selected={room} onSelect={handleSelectRoom} />
      </div>
    </div>
  );
};

export default Inbox;
