"use client";
import { SOCKET_NOTIFICATION_CHANNEL } from "@components/socket/socket";
import useSocket from "@components/socket/useSocket";
import { faBell, faClose } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useSelector } from "@node_modules/react-redux/dist/react-redux";
import { toastNotification, toastRequest, toastSuccess } from "@util/toaster";
import React, { useEffect, useRef, useState } from "react";
import NotificationItem from "./NotificationItem";
import {
  clearNotification,
  deleteNotification,
  readNotification,
  fetchNotification,
} from "@service/notification";
import NotificationButton from "./NotificationButton";

const Notification = () => {
  const session = useSelector((state) => state.session);

  const NOTIFICATION_LIMIT = 20;
  const skip = useRef("");
  const [isMore, setIsMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState([]);
  const socket = useSocket(session.customer?._id);

  const fetchMoreNotification = () => {
    if (!session.customer?._id || !isMore) return;
    fetchNotification(session.customer?._id, skip.current, NOTIFICATION_LIMIT)
      .then((data) => {
        const newNotifs = data.notifications || [];

        setNotification((prev) => [...prev, ...newNotifs]);

        // If we got fewer than expected, no more to load
        setIsMore(newNotifs.length === NOTIFICATION_LIMIT);

        // Set skip to the _id of the last (oldest) notification we received
        if (newNotifs.length > 0) {
          skip.current = newNotifs.at(-1)._id;
        }

        // Update unread count
        setUnreadCount(data.unreadCount);
      })
      .catch((error) => console.log(error));
  };

  const handleRead = (id) => {
    setNotification((prev) =>
      prev.map((noti) => (noti._id === id ? { ...noti, read: true } : noti))
    );

    const target = notification.find((noti) => noti._id === id);
    if (target && !target.read) {
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    }
    readNotification(session.customer?._id, id).catch((error) =>
      console.log(error)
    );
  };

  const handleDelete = (id) => {
    const target = notification.find((noti) => noti._id === id);
    if (target && !target.read) {
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    }
    setNotification((prev) => prev.filter((noti) => noti._id !== id));

    deleteNotification(session.customer?._id, id).catch((error) =>
      console.log(error)
    );
  };

  const handleClearAll = async () => {
    const hasUnread = notification.some((n) => !n.read);

    if (hasUnread) {
      const request = await toastRequest(
        "There are unread notifications. Are you sure you want to clear all?"
      );
      if (request) {
        setNotification([]);
        clearNotification(session.customer?._id).catch((error) =>
          console.log(error)
        );
      }
    } else {
      setNotification([]);
      clearNotification(session.customer?._id).catch((error) =>
        console.log(error)
      );
    }
  };

  useEffect(() => {
    session.customer?._id && fetchMoreNotification();
  }, [session.customer?._id]);

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_NOTIFICATION_CHANNEL.GET_NOTIFICATIONS, (data) => {
      toastNotification(data);
      setUnreadCount((prev) => prev + 1);
      setNotification((prev) => [data, ...prev]);
    });

    return () => {
      socket.off(SOCKET_NOTIFICATION_CHANNEL.GET_NOTIFICATIONS);
    };
  }, [socket]);

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-0 left-0 m-2 flex flex-col gap-2 bg-secondary/80 text-base text-on-secondary shadow-sm p-1 rounded z-50">
          <div className="flex flex-row gap-1 items-center justify-between px-2">
            <span className="text-lg font-semibold">Notification</span>
            <div className="flex flex-row gap-2 items-center ">
              <button className="text-sm " onClick={handleClearAll}>
                Clear
              </button>
              <button onClick={() => setIsOpen(false)}>
                <FontAwesomeIcon icon={faClose} />
              </button>
            </div>
          </div>
          <ul className="max-w-[400px] max-h-[300px] overflow-y-auto w-full flex flex-col gap-1 min-w-[300px] bg-secondary rounded p-1">
            {notification.map((noti) => (
              <NotificationItem
                key={noti._id}
                notification={noti}
                onRead={handleRead}
                onDelete={handleDelete}
              />
            ))}

            {isMore && (
              <button
                className="text-center text-xs"
                onClick={fetchMoreNotification}
              >
                See more
              </button>
            )}
          </ul>
        </div>
      ) : (
        <NotificationButton
          onClick={() => setIsOpen(true)}
          unread={unreadCount}
        />
      )}
    </>
  );
};

export default Notification;
