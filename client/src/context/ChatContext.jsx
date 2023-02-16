import { createContext, useState, useCallback, useEffect } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);

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

  return (
    <ChatContext.Provider
      value={{ userChats, isUserChatsLoading, userChatsError }}
    >
      {children}
    </ChatContext.Provider>
  );
};
