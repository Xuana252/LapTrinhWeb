import { SOCKET_NOTIFICATION_CHANNEL } from "@components/socket/socket";
import useSocket from "@components/socket/useSocket";
import { faBell } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { useSelector } from "@node_modules/react-redux/dist/react-redux";
import { toastRequest, toastSuccess } from "@util/toaster";
import React, { useEffect, useState } from "react";
import NotificationItem from "./NotificationItem";
import {
  clearNotification,
  deleteNotification,
  readNotification,
  fetchNotification,
} from "@service/notification";

const Notification = () => {
  const session = useSelector((state) => state.session);

  const NOTIFICATION_LIMIT = 20;
  const [skip, setSkip] = useState("");
  const [isMore, setIsMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState([]);
  const socket = useSocket(session.customer?._id);

  const fetchMoreNotification = () => {
    if (!session.customer?._id || !isMore) return;
    fetchNotification(session.customer?._id, skip, NOTIFICATION_LIMIT)
      .then((data) => {
        const newNotifs = data.notifications || [];

        setNotification((prev) => [...prev, ...newNotifs]);

        // If we got fewer than expected, no more to load
        setIsMore(newNotifs.length === NOTIFICATION_LIMIT);

        // Set skip to the _id of the last (oldest) notification we received
        if (newNotifs.length > 0) {
          setSkip(newNotifs.at(-1)._id);
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
    readNotification(session.customer?._id, id).catch((error) =>
      console.log(error)
    );
  };

  const handleDelete = (id) => {
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
    fetchMoreNotification();
  }, []);
  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_NOTIFICATION_CHANNEL.GET_NOTIFICATIONS, (data) => {
      toastSuccess(data.message);

      setUnreadCount((prev) => prev + 1);
      setNotification((prev) => [data, ...prev]);
    });

    // socket.on(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES, (data) => {
    //   if (data?.message_log?.length > 0) {
    //     setIsSeen(data.adminRead);
    //     setUnreadMessage(!data.customerRead);
    //     setMessageLog((prev) => [...prev, ...data.message_log]);
    //     isMore.current = data.message_log.length >= MESSAGE_LIMIT;
    //     skip.current = data.message_log.at(-1)._id || "";
    //   }

    //   setUnreadMessage(!data.customerRead);
    //   setIsLoading(false);
    // });

    // fetchMessageLog();

    return () => {
      socket.off(SOCKET_NOTIFICATION_CHANNEL.GET_NOTIFICATIONS);
      //   socket.off(SOCKET_INBOX_CHANNEL.GET_MESSAGES);
      //   socket.off(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES);
    };
  }, [socket]);

  return (
    <div className="relative flex items-center justify-center">
      <button className="relative" onClick={() => setIsOpen((prev) => !prev)}>
        <FontAwesomeIcon icon={faBell} />

        {unreadCount > 0 && (
          <div className=" absolute size-4 rounded-full bg-primary-variant text-on-primary text-xs flex items-center justify-center font-bold top-0 left-full -translate-x-1/2">
            {unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-[100%] right-0 flex flex-col gap-2 bg-secondary/80 text-base shadow-sm p-1 rounded z-50">
          <div className="flex flex-row gap-1 items-center justify-between px-2">
            <span className="text-lg font-semibold">Notification</span>
            <button className="text-sm " onClick={handleClearAll}>
              Clear
            </button>
          </div>
          <ul className="max-w-[400px] w-full flex flex-col gap-1 min-w-[300px] bg-secondary rounded p-1">
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
      )}
    </div>
  );
};

export default Notification;
