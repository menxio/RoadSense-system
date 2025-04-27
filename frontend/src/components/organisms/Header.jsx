import React from "react";
import { Box, Typography, Avatar, Stack } from "@mui/material";

const Header = ({ user }) => {
  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return "";
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        p: 2,
        backgroundColor: "white",
        borderBottom: "1px solid #eaeaea",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Box textAlign="right">
          <Typography variant="subtitle1" fontWeight="bold">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.role || "User"}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: "#0d1b2a" }}>
          {getInitials(user?.firstName, user?.lastName)}
        </Avatar>
      </Stack>
    </Box>
  );
};

export default Header;
