export const unreadNotificationsFunc = (notificaions) => {
  return notificaions.filter((n) => n.isRead === false);
};
