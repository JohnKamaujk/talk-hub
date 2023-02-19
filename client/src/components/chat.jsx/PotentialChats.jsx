import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const PotentialChats = () => {
  const { potentialChatMates } = useContext(ChatContext);

  console.log(potentialChatMates);

  return (
    <>
      <div className="all-users">
        {potentialChatMates &&
          potentialChatMates.map((mate, index) => {
            return (
              <div className="single-user" key={index}>
                {mate.name}
                <span className="user-online"></span>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default PotentialChats;
