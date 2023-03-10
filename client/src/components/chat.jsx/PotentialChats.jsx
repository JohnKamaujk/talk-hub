import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const PotentialChats = () => {
  const { potentialChatMates, createChat, onlineUsers } =
    useContext(ChatContext);
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className="all-users">
        {potentialChatMates &&
          potentialChatMates.map((mate, index) => {
            return (
              <div
                className="single-user"
                key={index}
                onClick={() => createChat(user._id, mate._id)}
              >
                {mate.name}
                <span
                  className={
                    onlineUsers?.some((user) => user?.userId == mate?._id)
                      ? "user-online"
                      : ""
                  }
                ></span>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default PotentialChats;
