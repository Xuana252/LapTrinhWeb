"use client";
import ChatList from "@components/Chat/ChatList";
import MessageBox from "@components/Chat/MessageBox";
import useSocket from "@components/socket/useSocket";
import React, { useState } from "react";

const Inbox = () => {
  const [room, setRooms] = useState(null);
  return (
    <div className="h-full w-full flex gap-2">
      <div className={`${room ? "" : "hidden md:inline-block"} grow`}>
        <MessageBox room={room} onSelect={setRooms} />
      </div>
      <div
        className={`${
          room ? "hidden md:inline-block  " : " "
        } grow  md:max-w-[40%] `}
      >
        <ChatList selected={room} onSelect={setRooms} />
      </div>
    </div>
  );
};

export default Inbox;
