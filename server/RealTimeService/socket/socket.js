const { Server } = require("socket.io");
const {
  SOCKET_INBOX_CHANNEL,
  SOCKET_JOIN_CHANNEL,
  SOCKET_NOTIFICATION_CHANNEL,
} = require("../constant/channel");

const {getAllUserMessage,getUserMessage,readMessage} = require("../controller/messageController")

let io = null;
const connectedCustomers = [];
let connectedStaff = null;
const connectedRooms = [];

function initializeSocket(server, API_GATEWAY) {
  io = new Server(server, {
    cors: {
      origin: API_GATEWAY,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.of("/realtime").on("connection", (socket) => {
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      const customerIndex = connectedCustomers.findIndex(
        (c) => c.socket_id === socket.id
      );
      if (customerIndex !== -1) {
        if (connectedStaff) {
          io.of("/realtime")
            .to(connectedStaff)
            .emit(SOCKET_JOIN_CHANNEL.CUSTOMER_LEAVE, {
              customer_id: connectedCustomers[customerIndex].user_id,
            });
        }
        connectedCustomers.splice(customerIndex, 1);
        console.log(`Customer ${socket.id} removed from connectedCustomers`);
      }

      if (connectedStaff === socket.id) {
        connectedStaff = null;
        console.log(`Staff ${socket.id} disconnected`);
      }

      connectedRooms.forEach((room) => {
        room.socket_id = room.socket_id.filter((id) => id !== socket.id);
      });

      for (let i = connectedRooms.length - 1; i >= 0; i--) {
        if (connectedRooms[i].socket_id.length === 0) {
          console.log(
            `Room ${connectedRooms[i].room_id} is now empty. Removing.`
          );
          connectedRooms.splice(i, 1);
        }
      }
    });

    console.log("A user connected:", socket.id);

    socket.on(
      SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES,
      async ({ room_id, skip, limit }) => {
        const userMessage = await getUserMessage(room_id, skip, limit);

        if (userMessage) {
          socket.emit(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES, {
            message_log: userMessage.message_log,
            customerRead: userMessage.customerRead,
            adminRead: userMessage.adminRead,
          });
        }
      }
    );

    socket.on(
      SOCKET_INBOX_CHANNEL.GET_MORE_CONVERSATIONS,
      async ({ searchText, page, limit }) => {
        const conversations = await getAllUserMessage(searchText, page, limit);
        const conversationsWithState = conversations.map((c) => ({
          ...c,
          online:
            connectedCustomers.findIndex(
              (cc) => cc.user_id === c._id.toString()
            ) !== -1,
        }));

        socket.emit(SOCKET_INBOX_CHANNEL.GET_MORE_CONVERSATIONS, {
          page: page,
          rooms: conversationsWithState,
        });
      }
    );

    socket.on(
      SOCKET_INBOX_CHANNEL.SEEN_MESSAGE,
      async ({ room_id, isCustomer }) => {
        await readMessage(room_id, isCustomer, !isCustomer);
        const room = connectedRooms.find((room) => room.room_id === room_id);
        if (room) {
          room.socket_id.forEach(async (socketId) => {
            if (socketId !== socket.id) {
              io.of("/realtime")
                .to(socketId)
                .emit(SOCKET_INBOX_CHANNEL.SEEN_MESSAGE, { isCustomer });
            }
          });
        }
      }
    );

    socket.on(
      SOCKET_INBOX_CHANNEL.ADD_MESSAGE,
      ({ room_id, customer, message }) => {
        const room = connectedRooms.find((room) => room.room_id === room_id);

        if (room) {
          if (connectedStaff) {
            io.of("/realtime")
              .to(connectedStaff)
              .emit(SOCKET_INBOX_CHANNEL.GET_CONVERSATIONS, {
                _id: room_id,
                online:
                  connectedCustomers.findIndex((c) => c.user_id === room_id) !==
                  -1,
                customerRead: socket.id !== connectedStaff,
                adminRead: room.socket_id.includes(connectedStaff),
                createdAt: new Date(),
                updatedAt: new Date(),
                customer,
                lastMessage: {
                  ...message,
                },
              });
          }

          room.socket_id.forEach(async (socketId) => {
            if (socketId !== socket.id) {
              io.of("/realtime")
                .to(socketId)
                .emit(SOCKET_INBOX_CHANNEL.GET_MESSAGES, {
                  room_id,
                  customer,
                  message,
                });
            }
          });
        }
      }
    );

    socket.on(SOCKET_JOIN_CHANNEL.CUSTOMER_JOIN, (data) => {
      console.log("Customer joined:", data);
      if (connectedStaff) {
        io.of("/realtime")
          .to(connectedStaff)
          .emit(SOCKET_JOIN_CHANNEL.CUSTOMER_JOIN, {
            customer_id: data.user_id,
          });
      }
      const existingIndex = connectedCustomers.findIndex(
        (c) => c.user_id === data.user_id
      );
      if (existingIndex === -1) {
        connectedCustomers.push({
          socket_id: socket.id,
          user_id: data.user_id,
        });
      }
    });

    socket.on(SOCKET_JOIN_CHANNEL.STAFF_JOIN, () => {
      console.log("Staff joined:", socket.id);
      connectedStaff = socket.id;
    });

    socket.on(SOCKET_INBOX_CHANNEL.JOIN_ROOM, ({ room_id }) => {
      socket.join(room_id);
      console.log(`Socket ${socket.id} joined room ${room_id}`);

      const room = connectedRooms.find((room) => room.room_id === room_id);

      if (room) {
        room.socket_id.push(socket.id);
      } else if (room_id) {
        connectedRooms.push({
          room_id: room_id,
          socket_id: [socket.id],
        });
      }
    });

    socket.on(SOCKET_INBOX_CHANNEL.LEAVE_ROOM, ({ room_id }) => {
      socket.leave(room_id);
      console.log(`Socket ${socket.id} leave room ${room_id}`);

      const roomIndex = connectedRooms.findIndex(
        (room) => room.room_id === room_id
      );

      if (roomIndex !== -1) {
        // Remove the socket ID from the array
        connectedRooms[roomIndex].socket_id = connectedRooms[
          roomIndex
        ].socket_id.filter((id) => id !== socket.id);

        // If no sockets remain, remove the room entirely
        if (connectedRooms[roomIndex].socket_id.length === 0) {
          connectedRooms.splice(roomIndex, 1);
          console.log(`Room ${room_id} removed due to no active sockets`);
        }
      }
    });
  });
}

module.exports = {
  initializeSocket,
  getIO: () => io,
  connectedCustomers,
  connectedStaff,
  connectedRooms,
};
