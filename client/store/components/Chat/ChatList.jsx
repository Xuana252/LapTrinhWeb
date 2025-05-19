"use client";
import useSocket from "@components/socket/useSocket";
import { faSearch } from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import RoomCard from "./RoomCard";
import {
  SOCKET_INBOX_CHANNEL,
  SOCKET_JOIN_CHANNEL,
} from "@constant/SocketChannel";

const ChatList = ({ selected, onSelect }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [isMore, setIsMore] = useState(true);
  const socket = useSocket();

  const inputRef = useRef(null);

  const ROOM_LIMIT = 20;

  const fetchRooms = () => {
    if (!socket || !isMore) return;

    setLoading(true);

    const payload = {
      searchText,
      page,
      limit: ROOM_LIMIT,
    };

    socket.emit(SOCKET_INBOX_CHANNEL.GET_MORE_CONVERSATIONS, payload);
  };

  useEffect(() => {
    fetchRooms();
  }, [searchText, page]);

  useEffect(() => {
    setRooms([]);
    setIsMore(true);
    setPage(1);
  }, [searchText]);

  const handleNewMessage = (payload) => {
    if (!payload || !payload._id) return;

    setRooms((prevRooms) => {
      const existingIndex = prevRooms.findIndex((r) => r._id === payload._id);

      if (existingIndex !== -1) {
        // Update existing room
        const updatedRooms = [...prevRooms];
        updatedRooms[existingIndex] = {
          ...updatedRooms[existingIndex],
          ...payload,
        };
        return updatedRooms;
      } else {
        // Add new room to the top
        return [payload, ...prevRooms];
      }
    });
  };

  const handleMoreMessage = (data) => {
    if (data) {
      if (data.page === 1) {
        setRooms(data.rooms);
      } else {
        setRooms((prev) => [...prev, ...data.rooms]);
      }
      setIsMore(data.rooms.length >= ROOM_LIMIT);
    }
    setLoading(false);
  };

  const handleSelectRoom = (room) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r._id === room._id) {
          const newRoom = { ...r, adminRead: true };
          return newRoom;
        }
        return r;
      })
    );
    if (socket) {
      if (selected)
        socket.emit(SOCKET_INBOX_CHANNEL.LEAVE_ROOM, { room_id: selected._id });
      socket.emit(SOCKET_INBOX_CHANNEL.JOIN_ROOM, { room_id: room._id });
    }
    onSelect(room);
  };

  const handleOnlineState = (customer_id, state) => {
    if (selected?._id === customer_id) {
      const newRoom = { ...selected, online: state };
      onSelect(newRoom);
    }

    setRooms((prev) =>
      prev.map((room) => {
        if (room._id === customer_id) {
          const newRoom = { ...room, online: state };
          return newRoom;
        }
        return room;
      })
    );
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_JOIN_CHANNEL.CUSTOMER_JOIN, ({ customer_id }) =>
      handleOnlineState(customer_id, true)
    );
    socket.on(SOCKET_JOIN_CHANNEL.CUSTOMER_LEAVE, ({ customer_id }) =>
      handleOnlineState(customer_id, false)
    );

    socket.on(SOCKET_INBOX_CHANNEL.GET_CONVERSATIONS, handleNewMessage);

    socket.on(SOCKET_INBOX_CHANNEL.GET_MORE_CONVERSATIONS, handleMoreMessage);

    fetchRooms();

    return () => {
      socket.off(SOCKET_JOIN_CHANNEL.CUSTOMER_JOIN);
      socket.off(SOCKET_JOIN_CHANNEL.CUSTOMER_LEAVE);
      socket.off(SOCKET_INBOX_CHANNEL.GET_CONVERSATIONS);
      socket.off(SOCKET_INBOX_CHANNEL.GET_MORE_CONVERSATIONS);
    };
  }, [socket]);

  return (
    <div className="flex flex-col gap-2 h-full panel-3">
      <div className="panel-3">
        <div className="rounded-full w-full bg-primary-variant text-base flex flex-row items-center p-1">
          <input
            ref={inputRef}
            type="text"
            className="grow h-full bg-transparent min-w-[100px]  px-2 text-on-primary placeholder:text-on-primary outline-none overflow-scroll"
            placeholder="username, email..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchText(inputRef.current.value);
              }
            }}
          />
          <button
            onClick={() => setSearchText(inputRef.current.value)}
            className="text-xl text-surface rounded-full bg-on-surface h-full aspect-square flex items-center justify-center p-1"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>

      <div className="grow overflow-auto">
        <ul className="flex flex-col overflow-auto h-full gap-1">
          {rooms
            ?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .map((room) => (
              <div key={room._id} onClick={() => handleSelectRoom(room)}>
                <RoomCard room={room} />
              </div>
            ))}
          {loading &&
            Array.from({ length: ROOM_LIMIT }).map((_, index) => (
              <RoomCard key={index} loading={true} />
            ))}

          {isMore && (
            <button
              onClick={() => {
                setPage((prev) => prev + 1);
              }}
            >
              See more
            </button>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChatList;
