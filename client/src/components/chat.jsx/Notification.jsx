import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userChats, notifications, allUsers } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const unreadNotifications = unreadNotificationsFunc(notifications);
  const modifiedNotifications = notifications.map((notification) => {
    const sender = allUsers.find((user) => user._id == notification.senderId);
    return {
      ...notification,
      senderName: sender?.name,
    };
  });

  return (
    <div className="notifications">
      <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-bell-fill"
          viewBox="0 0 16 16"
        >
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
        </svg>
        {unreadNotifications?.length === 0 ? null : (
          <span className="notification-count">
            <span>{unreadNotifications?.length}</span>
          </span>
        )}
      </div>
      {isOpen && (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div className="mark-as-read">Mark all as read</div>
          </div>
          {modifiedNotifications?.length === 0 ? (
            <span className="notification">No notifications...</span>
          ) : null}
          {modifiedNotifications &&
            modifiedNotifications.map((notification, index) => {
              return (
                <div
                  key={index}
                  className={
                    notification.isRead
                      ? "notification"
                      : "notification not-read"
                  }
                >
                  <span>{`${notification.senderName} sent you a message`}</span>
                  <span className="notification-time">
                    {moment(notification.date).calendar()}
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Notification;
