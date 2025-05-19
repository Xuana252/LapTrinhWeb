import { faTrash } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import { formattedDateTime } from "@util/format";
import React from "react";

const NotificationItem = ({ notification, onRead, onDelete }) => {
  return (
    <div
      className="grid grid-rows-[1fr_auto] rounded-md gap-1  text-sm bg-surface/70 hover:bg-surface p-1 border-2 border-on-surface text-on-surface cursor-pointer"
      onClick={() => {
        !notification.read && onRead(notification._id);
      }}
    >
      <div className="grid grid-cols-[1fr_auto] gap-1">
        <div className="whitespace-pre-line">{notification.message}</div>
        <div className="w-2">
          {!notification.read && (
            <div className="size-2 rounded-full bg-red-500"></div>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-2 justify-between items-center">
        <div className="text-right text-xs opacity-50">
          {formattedDateTime(notification.createdAt)}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            onDelete(notification._id);
          }}
        >
          <FontAwesomeIcon icon={faTrash} size="xs" />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
