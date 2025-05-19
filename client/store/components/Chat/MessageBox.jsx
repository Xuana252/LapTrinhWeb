"use client";

import useSocket from "@components/socket/useSocket";
import ProfileImageHolder from "@components/UI/ProfileImageHolder";
import {
  SOCKET_INBOX_CHANNEL,
  SOCKET_JOIN_CHANNEL,
} from "@constant/SocketChannel";
import {
  faAngleDown,
  faCheck,
  faClose,
  faPaperPlane,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { sendMessage } from "@service/message";
import { formattedDateTime } from "@util/format";
import { toastError } from "@util/toaster";
import React, { useRef, useState, useEffect } from "react";

const MessageBox = ({ room, onSelect }) => {
  const MESSAGE_LIMIT = 20;
  const [isLoading, setIsLoading] = useState(false);
  const [messageLog, setMessageLog] = useState([]);
  const isMore = useRef(true);
  const skip = useRef("");
  const [isSeen, setIsSeen] = useState(room?.customerRead ?? false);

  const [isScrolledUp, setIsScrolledUp] = useState(false);

  const messageLogRef = useRef(null);
  const inputRef = useRef(null);
  const sentinelRef = useRef(null);

  const socket = useSocket();

  const fetchMessageLog = async () => {
    if (isLoading || !isMore.current || !room?._id) return;
    setIsLoading(true);

    try {
      const payload = {
        room_id: room._id,
        skip: skip.current,
        limit: MESSAGE_LIMIT,
      };
      socket.emit(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES, payload);
    } catch (error) {
      console.error("Failed to fetch older messages:", error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (isMore.current && !isLoading) {
            console.log("fetching more");
            fetchMessageLog();
          } else if (!isMore.current && sentinelRef.current) {
            obs.unobserve(sentinelRef.current);
            console.log("No more messages. Observer disconnected.");
          }
        }
      },
      {
        root: messageLogRef.current,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [isLoading]);

  useEffect(() => {
    if (!socket) return;

    socket.off(SOCKET_INBOX_CHANNEL.SEEN_MESSAGE);
    socket.off(SOCKET_INBOX_CHANNEL.GET_MESSAGES);
    socket.off(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES);

    socket.on(SOCKET_INBOX_CHANNEL.SEEN_MESSAGE, ({ isCustomer }) => {
      isCustomer && setIsSeen(true);
    });

    socket.on(SOCKET_INBOX_CHANNEL.GET_MESSAGES, (data) => {
      socket.emit(SOCKET_INBOX_CHANNEL.SEEN_MESSAGE, {
        room_id: room?._id,
        isCustomer: false,
      });
      setMessageLog((prev) => [
        {
          ...data.message,
        },
        ...prev,
      ]);
    });

    socket.on(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES, (data) => {
      if (data?.message_log?.length > 0) {
        setMessageLog((prev) => [...prev, ...data.message_log]);

        skip.current = data.message_log.at(-1)._id || "";
      }
      isMore.current = data.message_log.length >= MESSAGE_LIMIT;

      setIsLoading(false);
    });

    return () => {
      socket.off(SOCKET_INBOX_CHANNEL.SEEN_MESSAGE);
      socket.off(SOCKET_INBOX_CHANNEL.GET_MESSAGES);
      socket.off(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES);
    };
  }, [socket, room?._id]);

  useEffect(() => {
    setMessageLog([]);
    isMore.current = true;
    skip.current = "";

    if (!room?._id) return;

    fetchMessageLog();

    if (!socket) return;

    socket.emit(SOCKET_INBOX_CHANNEL.SEEN_MESSAGE, {
      room_id: room._id,
      isCustomer: false,
    });
  }, [room?._id]);

  const handleSend = async () => {
    if (
      socket &&
      inputRef.current &&
      inputRef.current.value.trim() &&
      room?._id
    ) {
      const message = inputRef.current.value.trim();
      const payload = {
        message: message,
        sender: false,
        customerRead: false,
        adminRead: true,
      };

      await sendMessage(room?.customer?._id, payload)
        .then((data) => {
          if (data) {
            const msgData = {
              room_id: room?.customer?._id,
              customer: room?.customer,
              message: data,
            };

            socket.emit(SOCKET_INBOX_CHANNEL.ADD_MESSAGE, msgData);

            setMessageLog((prevMessages) => [{ ...data }, ...prevMessages]);
            setIsSeen(false);
            inputRef.current.value = "";
          }
        })
        .catch((error) => {
          toastError("Failed to send message");
          console.log(error);
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
  };

  const handleScrollToBottom = () => {
    if (messageLogRef.current) {
      messageLogRef.current.scrollTo({
        top: messageLogRef.current.scrollHeight,
        behavior: "smooth", // Optional: smooth scroll effect
      });
    }
  };

  return (
    <div className="w-full h-full grid grid-rows-[auto_1fr_auto] rounded overflow-hidden shadow-xl z-50 relative">
      <div className="size-full grid grid-cols-[1fr_auto] items-center bg-primary-variant text-on-primary p-1 ">
        <div className="flex flex-row items-center justify-start p-2 gap-2">
          <div
            className={`${
              room?.online ? "outline outline-2 outline-green-500" : ""
            } rounded-full`}
          >
            <ProfileImageHolder url={room?.customer?.image} size={36} />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold ">{room?.customer?.username}</span>
            <span className="text-sm opacity-50">{room?.customer?.email}</span>
          </div>
        </div>
        <button className="p-2 text-xl" onClick={() => onSelect(null)}>
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
            !messageLog?.at(0)?.sender ? "flex-row-reverse" : "flex-row"
          } text-xs opacity-50 flex items-center gap-1`}
        >
          {isSeen && <FontAwesomeIcon icon={faCheck} />}
          {formattedDateTime(messageLog?.at(0)?.createdAt)}
        </div>
        {room&&messageLog?.map((item) => (
          <li
            key={item._id}
            className={`${!item.sender ? "my-message" : "other-message"}`}
          >
            {item.message}
          </li>
        ))}
        <div ref={sentinelRef} className="h-2" />

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
  );
};

export default MessageBox;
