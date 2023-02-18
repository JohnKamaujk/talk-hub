import { useState, useEffect } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipientId = chat?.members.find((id) => id !== user?._id);

  useEffect(() => {
    const getRecipientUser = async () => {
      if (!recipientId) return null;

      const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

      if (response?.error) {
        setError(response);
      }

      setRecipientUser(response);
    };
    getRecipientUser();
  }, []);

  return { recipientUser };
};
