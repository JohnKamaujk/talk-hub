import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const PotentialChats = () => {
  const { potentialChats } = useContext(ChatContext);

  console.log(potentialChats);

  return <div>Start Chats</div>;
};

export default PotentialChats;
