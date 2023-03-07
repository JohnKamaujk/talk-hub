import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchLatestMesssage = (chat) => {
  const [latestMessage, setLatestMessage] = useState(null);
  const [notifications, newMessage] = useContext(ChatContext);

  useEffect(() => {
    const getMessages = async () => {
      const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);
      if (response.error) {
        return console.log("error getting messages", error);
      }
      const lastMessage = response[response?.length - 1];

      setLatestMessage(lastMessage);
    };
    getMessages();
  }, [notifications, newMessage]);

  return { latestMessage };
};
