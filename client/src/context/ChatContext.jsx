import { createContext, useState, useCallback, useEffect } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChatMates, setPotentialChatMates] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  //connecting client to io socket
  useEffect(() => {
    const newSocket = io("http://localhost:3000/");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // trigger an emit event to socket to get all online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (response) => {
      setOnlineUsers(response);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  console.log(onlineUsers);

  //send message to the socket server which will update the recipient user in realtime
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members.find((id) => id !== user?._id);
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  //recieve newmessage/notification from the socket server which will in turn update the messages in the client side
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (response) => {
      if (currentChat?._id !== response.chatId) return;

      setMessages((prev) => [...prev, response]);
    });

    socket.on("getNotification", (response) => {
      const isChatOpen = currentChat?.members.some(
        (id) => id === response.senderId
      );
      if (isChatOpen) {
        setNotifications((prev) => [{ ...response, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [response, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat, messages]);

  //getting all users who have never had chat with user,potential chatmates
  useEffect(() => {
    const getAllUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return console.log(response);
      }

      // Getting all chat mates who've never chatted with our user
      const pChatMates = response.filter((chatUser) => {
        // This removes logged in user
        if (chatUser._id === user?._id) return false;

        let isChatCreated = false;

        // This removes a user who has ever had a chat with loggedin user
        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return (
              chat.members[0] === chatUser._id ||
              chat.members[1] === chatUser._id
            );
          });
        }
        return !isChatCreated;
      });
      setPotentialChatMates(pChatMates);
      setAllUsers(response);
    };

    getAllUsers();
  }, [userChats]);

  useEffect(() => {
    const getUsersChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
        setIsUserChatsLoading(false);

        if (response.error) {
          return setUserChatsError(response);
        }
        setUserChats(response);
      }
    };
    getUsersChats();
  }, [user]);

  //Getting all messages associated with current chat
  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );
      setIsMessagesLoading(false);

      if (response.error) {
        return setMessagesError(response);
      }
      setMessages(response);
    };
    getMessages();
  }, [currentChat]);

  //Current chat is the chat a user has clicked to join
  const updateCurrentChat = useCallback(async (chat) => {
    setCurrentChat(chat);
  });

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats/`,
      JSON.stringify({ firstId, secondId })
    );

    if (response.error) {
      return console.log(response);
    }

    setUserChats((prev) => [...prev, response]);
  }, []);

  // sending text message to the db
  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return console.log("You cannot send empty message");

      const response = await postRequest(
        `${baseUrl}/messages/`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );

      if (response.error) {
        return setSendTextMessageError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    []
  );
  //Mark all notifications as read
  const readAllNotifications = useCallback((notifications) => {
    const readNotifications = notifications.map((notification) => {
      return { ...notification, isRead: true };
    });
    setNotifications(readNotifications);
  }, []);
  //Mark a single notification as read
  const readNotification = useCallback(
    (notification, userChats, user, notifications) => {
      //find the right chat associated with that notifcation to open
      const rightChat = userChats.find((chat) => {
        const chatMembers = [user._id, notification.senderId];
        const isRightChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });
        return isRightChat;
      });

      //mark that notifiction as read after opening it
      const mNotifications = notifications.map((n) => {
        if (notification.senderId === n.senderId) {
          return { ...notification, isRead: true };
        } else {
          return el;
        }
      });

      setNotifications(mNotifications);
      updateCurrentChat(rightChat);
    },
    []
  );
  //mark notifications from a specific user as read
  const markthisUserNotificationAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      const modifiedNotifications = notifications.map((el) => {
        let notification;

        thisUserNotifications.forEach((n) => {
          if (n.senderId === el.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = el;
          }
        });
        return notification;
      });

      setNotifications(modifiedNotifications);
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChatMates,
        createChat,
        currentChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        readAllNotifications,
        readNotification,
        markthisUserNotificationAsRead
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
