export const unreadNotificationsFunc = (notifications) => {
  return notifications.filter((notification) => notification.isRead === false);
};
