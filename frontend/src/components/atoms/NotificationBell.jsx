import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/notification.service";
import { fetchUserProfile } from "@/redux/slices/userSlice";
import echo from "@/utils/echo";

const NotificationBell = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user.name) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user.name]);

  useEffect(() => {
    if (user.custom_id) {
      console.log("Subscribing to channel:", `notifications.${user.custom_id}`);
      const channel = echo.channel(`notifications.${user.custom_id}`);

      channel.notification((notification) => {
        console.log("Notification received (Echo .notification):", notification);
        setNotifications((prev) => [
          {
            ...notification,
            title: notification.title || notification.data?.title || "No Title",
            message: notification.message || notification.data?.message || "No message",
            url: notification.url || notification.data?.url || "",
            time: notification.time || notification.data?.time || new Date().toLocaleString(),
            read: false,
            id: notification.id || notification.data?.id || Math.random().toString(36).substr(2, 9),
          },
          ...prev,
        ]);
      });
    }
  }, [user.custom_id]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user.id) {
        try {
          const data = await getNotifications(user.id);
          setNotifications(data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    fetchNotifications();
  }, [user.id]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    markAllNotificationsAsRead(user.id)
      .then(() => {
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, read: true }))
        );
      })
      .catch((error) =>
        console.error("Error marking all notifications as read:", error)
      );
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(user.id, id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "notifications-popover" : undefined;

  return (
    <>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        sx={{ color: "inherit", mr: 2 }}
      >
        <Badge
          badgeContent={notifications.filter((n) => !n.read).length}
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <Box sx={{ p: 2, bgcolor: "#0d1b2a", color: "white" }}>
          <Typography variant="h6" fontWeight="bold">
            Notifications
          </Typography>
        </Box>
        <Divider />
        {notifications.length > 0 ? (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, idx) => (
              <React.Fragment key={notification.id || notification.title + notification.message + idx}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    bgcolor: notification.read
                      ? "transparent"
                      : "rgba(13, 27, 42, 0.05)",
                    py: 1.5,
                  }}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "#0d1b2a" }}>
                      {notification.title?.charAt(0) || "!"}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight="bold">
                        {notification.title || "No Title"}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ display: "block" }}
                        >
                          {notification.message || "No message"}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {notification.time || new Date().toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </Box>
        )}
      </Popover>
    </>
  );
};

export default NotificationBell;
