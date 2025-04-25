"use client";
import {
  faAngleDown,
  faHeadset,
  faPaperPlane,
  faPhone,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import InputBox from "../Input/InputBox";
import { useSelector } from "@node_modules/react-redux/dist/react-redux";
import { getMessageLog, getMessages, sendMessage } from "@service/message";
import SupportButton from "./SupportButton";
import { toastError } from "@util/toaster";
import useSocket from "@components/socket/useSocket";
import { io } from "@node_modules/socket.io-client/build/esm";

export const SOCKET_JOIN_CHANNEL = {
  STAFF_JOIN: "STAFF_JOIN",
  STAFF_LEAVE: "STAFF_LEAVE",

  CUSTOMER_JOIN: "CUSTOMER_JOIN",
  CUSTOMER_LEAVE: "CUSTOMER_LEAVE",
};

export const SOCKET_INBOX_CHANNEL = {
  JOIN_ROOM: "JOIN_ROOM",
  LEAVE_ROOM: "LEAVE_ROOM",

  GET_MORE_MESSAGES: "GET_MORE_MESSAGES",
  ADD_MESSAGE: "ADD_MESSAGE",
  GET_MESSAGES: "GET_MESSAGES",
  DELETE_MESSAGE: "DELETE_MESSAGE",

  GET_CONVERSATIONS: "GET_CONVERSATIONS",
  DELETE_CONVERSATION: "DELETE_CONVERSATION",
};

const SupportChatBox = () => {
  const session = useSelector((state) => state.session);

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadMessage, setUnreadMessage] = useState(0);
  const [messageLog, setMessageLog] = useState([]);

  const [isMore, setIsMore] = useState(true);
  const [skip, setSkip] = useState(0);

  const [isScrolledUp, setIsScrolledUp] = useState(false);

  const messageLogRef = useRef(null);
  const inputRef = useRef(null);

  const socket = useSocket(session.customer?.customer_id);

  const fetchMessageLog = async () => {
    if (isLoading || !isMore) return;
    setIsLoading(true);
    try {
      const payload = {
        room_id: session.customer.customer_id,
        skip: skip,
      };
      socket.emit(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES, payload);
    } catch (error) {
      console.error("Failed to fetch older messages:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;
  
    socket.on("connect", () => {
      console.log("connected for chat");

      fetchMessageLog()
  
      socket.on(SOCKET_INBOX_CHANNEL.GET_MESSAGES, (data) => {
        console.log("new message received", data);
        setMessageLog((prev) => [
          {
            ...data.message,
            is_customer: data.message.sender.sender_id === session.customer?.customer_id,
            is_seen:isOpen,
          },
          ...prev,
        ]);
      });
  
      socket.on(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES, (data) => {
        console.log("old message received", data);
        if (data?.messages?.length > 0) {
          setMessageLog((prev) => [
            ...prev,
            ...data.messages.map((msg) => ({
              ...msg,
              is_customer: msg.sender.sender_id === session.customer?.customer_id,
            })),
          ]);
          setIsMore(data.messages.length >= 20);
          setSkip((prev) => prev + (data.messages.length > 0 ? 1 : 0));
        }
        
        setIsLoading(false);
      });
    });
  
    return () => {
      socket.off(SOCKET_INBOX_CHANNEL.GET_MESSAGES);
      socket.off(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES);
    };
  }, [socket]);
  

  const handleSend = async () => {
    if(!session.isAuthenticated) {
      toastError("Please login to chat with us");
      inputRef.current.value = "";
      return;
    }
    if (
      socket &&
      inputRef.current &&
      inputRef.current.value.trim() &&
      session.customer
    ) {
      const message = inputRef.current.value.trim();
      const payload = {
        customer_id: session.customer?.customer_id,
        content: {
          sender: {
            sender_id: session.customer?.customer_id,
            sender_name: session.customer?.username,
          },
          message: message,
        },
      };
      await sendMessage(payload).then((data) => {
        if (data) {
          const msgData = {
            room_id: session.customer?.customer_id,
            customer: session.customer,
            message: data,
          };

          console.log(socket);
          socket.emit(SOCKET_INBOX_CHANNEL.ADD_MESSAGE, msgData);
          setMessageLog((prevMessages) => [
            { ...data, is_customer: true, is_seen:true},
            ...prevMessages,
          ]);
          inputRef.current.value = "";
        } else {
          toastError("Failed to send message");
        }
      });
    }
  };

  const handleScroll = () => {
    if (!messageLogRef.current || isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = messageLogRef.current;

    // Check if the user has scrolled up
    if (Math.abs(scrollTop) > 200) {
      setIsScrolledUp(true); // User has scrolled up
    } else {
      setIsScrolledUp(false); // User is at the bottom
    }

    // If we are at the top of the container, fetch more messages
    if (Math.abs(scrollTop) + clientHeight >= scrollHeight) {
      fetchMessageLog();
    }
  };

  const handleScrollToBottom = () => {
    if (isOpen && messageLogRef.current) {
      messageLogRef.current.scrollTo({
        top: messageLogRef.current.scrollHeight,
        behavior: "smooth", // Optional: smooth scroll effect
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setMessageLog((ml) => ml.map((item) => ({ ...item, is_seen: true })));
    }
  }, [isOpen]);

  useEffect(() => {
    setUnreadMessage(
      messageLog.reduce((acc, item) => acc + (item.is_seen ? 0 : 1), 0)
    );
  }, [messageLog, isOpen]);

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-0 right-0 w-full sm:w-[400px] h-[500px] grid grid-rows-[auto_1fr_auto] shadow-xl z-50">
          <div className="size-full grid grid-cols-[1fr_auto] items-center bg-primary-variant text-on-primary p-2 rounded-t-xl">
            <div className="flex flex-row items-center justify-start p-2 gap-2">
              <FontAwesomeIcon icon={faHeadset} className="text-2xl" />
              <h2 className="font-bold text-xl ">Electro Support</h2>
            </div>
            <button className="p-2 text-xl" onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>

          <ul
            ref={messageLogRef}
            onScroll={handleScroll}
            className="bg-primary/70 backdrop-blur-sm flex flex-col-reverse w-full h-[380px]  justify-items-end gap-4 overflow-y-scroll no-scrollbar py-4 px-2"
          >
            {messageLog?.slice(0).map((item) => (
              <li
                key={item.message_id}
                className={`${
                  item.is_customer ? "my-message" : "other-message"
                }`}
              >
                {item.message}
              </li>
            ))}
            {isLoading && (
              <div className="animate-pulse text-lg text-on-primary font-bold w-full text-center">
                Loading...
              </div>
            )}
          </ul>

          {isScrolledUp && (
            <div className="absolute bottom-[70px] flex items-center justify-center w-full">
              <button
                className=" bg-on-primary text-primary size-9 shadow-lg rounded-full z-50"
                onClick={handleScrollToBottom}
              >
                <FontAwesomeIcon icon={faAngleDown} />
              </button>
            </div>
          )}

          <div className="bg-primary-variant text-on-primary flex p-2">
            <div className="rounded-full bg-surface size-full p-1 flex flex-row items-center justify-between">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask us something..."
                className="grow bg-transparent select-none outline-none px-2"
              />
              <button
                className="p-1 size-9 rounded-full bg-on-surface text-lg text-surface hover:scale-105 active:scale-95 transition-all duration-200"
                onClick={handleSend}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <SupportButton
          onClick={() => setIsOpen(true)}
          unreadMsg={unreadMessage}
        />
      )}
    </>
  );
};

export default SupportChatBox;
