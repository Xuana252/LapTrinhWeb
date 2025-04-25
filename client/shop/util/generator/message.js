function getRandomString(length = 10) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
  function getRandomDate() {
    const startDate = new Date(2020, 0, 1);
    const endDate = new Date();
    return new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
    );
  }
  
  function generateMockSender() {
    // Randomly choose sender_id between '123' and another random ID
    const sender_id = Math.random() < 0.5 ? '123' : getRandomString(10);
  
    return {
      sender_id: sender_id,
      sender_name: `${getRandomString(5)} ${getRandomString(7)}`,
    };
  }
  
  function generateMockMessage(text) {
    const sender = generateMockSender();
    return {
      sender: sender,
      message_id: getRandomString(12),
      message: text + " " + getRandomString(20),
      created_at: getRandomDate().toISOString(),
      is_seen: Math.random() < 0.5, // Randomly setting as seen or not
    };
  }
  
  export function generateMockInboxRoom(numMessages = 20) {
    const messages = [];
    for (let i = 0; i < numMessages; i++) {
      messages.push(generateMockMessage(i));
    }
  
    return {
      room_id: getRandomString(8),
      customer_id: '123',
      customer: '123',
      messages: messages,
    };
  }
  