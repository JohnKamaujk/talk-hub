import { createContext, useState, useCallback, useEffect } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChatMates, setPotentialChatMates] = useState([]);

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

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChatMates,
        createChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
