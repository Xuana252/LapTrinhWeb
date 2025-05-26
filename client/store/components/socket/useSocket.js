// useSocket.js
'use client'

import { useState, useEffect } from "react";
import { getSocket } from "./socket";

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);
  }, []);

  return socket;
};

export default useSocket;
