import React, { useContext } from "react";
import moment from "moment";
import { Stack } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, isMessagesLoading } = useContext(ChatContext);

  console.log(messages);

  const { recipientUser } = useFetchRecipientUser(currentChat, user);

  if (!recipientUser)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No Conversations selected yet...
      </p>
    );

  if (isMessagesLoading)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>Loading Chat...</p>
    );

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{recipientUser?.name}</strong>
      </div>
      <Stack gap={3} className={messages}>
        {messages &&
          messages?.map((message, index) => {
            return (
              <Stack
                key={index}
                className={`${
                  message?.senderId === user?._id
                    ? "message self align-self-end flex-grow-0"
                    : "message align-self-start flex-grow-0"
                }`}
              >
                <span>{message.text}</span>
                <span className={"message-footer"}>
                  {moment(message?.createdAt).calendar()}
                </span>
              </Stack>
            );
          })}
      </Stack>
    </Stack>
  );
};

export default ChatBox;
