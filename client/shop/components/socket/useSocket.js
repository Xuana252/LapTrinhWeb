// useSocket.js
"use client";

import { useState, useEffect } from "react";
import { getSocket } from "./socket";

const useSocket = (customerId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!customerId) return;
    const socketInstance = getSocket(customerId);
    setSocket(socketInstance);
  }, [customerId]);

  return socket;
};

export default useSocket;
