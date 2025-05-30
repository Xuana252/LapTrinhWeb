"use client";
import {
  faAngleDown,
  faCheck,
  faClose,
  faHeadset,
  faPaperPlane,
  faPhone,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import InputBox from "../Input/InputBox";
import { useSelector } from "@node_modules/react-redux/dist/react-redux";
import { sendMessage } from "@service/message";
import SupportButton from "./SupportButton";
import { toastError } from "@util/toaster";
import useSocket from "@components/socket/useSocket";
import { io } from "@node_modules/socket.io-client/build/esm";
import { formattedDateTime } from "@util/format";
import { SOCKET_INBOX_CHANNEL } from "@components/socket/socket";

const SupportChat = () => {
  const session = useSelector((state) => state.session);

  const MESSAGE_LIMIT = 20;

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSeen, setIsSeen] = useState(false);
  const [unreadMessage, setUnreadMessage] = useState(false);
  const [messageLog, setMessageLog] = useState([]);

  const isMore = useRef(true);
  const skip = useRef("");

  const [isScrolledUp, setIsScrolledUp] = useState(false);

  const messageLogRef = useRef(null);
  const inputRef = useRef(null);

  const socket = useSocket(session.customer?._id);

  const fetchMessageLog = async () => {
    if (isLoading || !isMore.current) return;
    setIsLoading(true);
    try {
      const payload = {
        room_id: session.customer._id,
        skip: skip.current,
        limit: MESSAGE_LIMIT,
      };
      socket.emit(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES, payload);
    } catch (error) {
      console.error("Failed to fetch older messages:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_INBOX_CHANNEL.SEEN_MESSAGE, ({ isCustomer }) => {
      !isCustomer && setIsSeen(true);
    });

    socket.on(SOCKET_INBOX_CHANNEL.GET_MESSAGES, (data) => {
      setMessageLog((prev) => [
        {
          ...data.message,
        },
        ...prev,
      ]);
      if (isOpen) {
        socket.emit(SOCKET_INBOX_CHANNEL.SEEN_MESSAGE, {
          room_id: session.customer?._id,
          isCustomer: true,
        });
      }

      setUnreadMessage(!isOpen);
    });

    socket.on(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES, (data) => {
      if (data?.message_log?.length > 0) {
        setIsSeen(data.adminRead);
        setUnreadMessage(!data.customerRead);
        setMessageLog((prev) => [...prev, ...data.message_log]);
        isMore.current = data.message_log.length >= MESSAGE_LIMIT;
        skip.current = data.message_log.at(-1)._id || "";
      }

      setUnreadMessage(!data.customerRead);
      setIsLoading(false);
    });

    fetchMessageLog();

    return () => {
      socket.off(SOCKET_INBOX_CHANNEL.SEEN_MESSAGE);
      socket.off(SOCKET_INBOX_CHANNEL.GET_MESSAGES);
      socket.off(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES);
    };
  }, [socket]);

  useEffect(() => {
    if (isOpen) {
      setUnreadMessage(false);
      if (!socket) return;
      socket.emit(SOCKET_INBOX_CHANNEL.SEEN_MESSAGE, {
        room_id: session.customer?._id,
        isCustomer: true,
      });
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!session.isAuthenticated) {
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
        message: message,
        sender: true,
        customerRead: true,
        adminRead: false,
      };

      await sendMessage(session.customer?._id, payload).then((data) => {
        if (data) {
          const msgData = {
            room_id: session.customer?._id,
            customer: session.customer,
            message: data,
          };

          socket.emit(SOCKET_INBOX_CHANNEL.ADD_MESSAGE, msgData);
          setMessageLog((prevMessages) => [{ ...data }, ...prevMessages]);
          setIsSeen(false);
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

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-0 right-0 w-full sm:w-[400px] h-[500px] grid grid-rows-[auto_1fr_auto] overflow-auto shadow-xl z-50">
          <div className="size-full grid grid-cols-[1fr_auto] items-center bg-primary-variant text-on-primary p-1 rounded-t">
            <div className="flex flex-row items-center justify-start p-2 gap-2">
              <FontAwesomeIcon icon={faHeadset} className="text-xl" />
              <h2 className="font-bold text-xl ">Electro Support</h2>
            </div>
            <button className="p-2 text-xl" onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>

          <ul
            ref={messageLogRef}
            onScroll={handleScroll}
            className="bg-primary/70 backdrop-blur-sm flex flex-col-reverse w-full justify-items-end gap-1 overflow-y-scroll no-scrollbar py-4 px-2"
          >
            <div
              className={`${
                messageLog?.at(0)?.sender ? "flex-row-reverse" : "flex-row"
              } text-xs opacity-50 flex flex-row items-center gap-1`}
            >
              {isSeen && <FontAwesomeIcon icon={faCheck} />}
              {formattedDateTime(messageLog?.at(0)?.createdAt)}
            </div>
            {messageLog?.slice(0).map((item) => (
              <li
                key={item._id}
                className={`${item.sender ? "my-message" : "other-message"}`}
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

          <div className="bg-primary-variant text-on-primary flex p-1">
            <div className="rounded-full bg-surface size-full p-1 flex flex-row items-center justify-between text-sm">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask us something..."
                className="grow bg-transparent select-none outline-none px-2 "
              />
              <button
                className="p-1 size-7 rounded-full bg-on-surface text-surface hover:scale-105 active:scale-95 transition-all duration-200"
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

export default SupportChat;
