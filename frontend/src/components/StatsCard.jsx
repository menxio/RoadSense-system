"use client"
import PropTypes from "prop-types"
import { Card, CardContent, Typography, Button, Box, useMediaQuery, useTheme } from "@mui/material"

export const StatsCard = ({ icon, title, value, actionText, iconBgColor, actionTextColor, onAction }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Card
      elevation={1}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        },
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: isMobile ? 2 : 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            mb: 2,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              backgroundColor: iconBgColor,
              color: "white",
              mr: isMobile ? 0 : 1.5,
              mb: isMobile ? 1.5 : 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: isMobile ? 40 : 48,
              height: isMobile ? 40 : 48,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: isMobile ? "0.75rem" : "0.875rem",
                textAlign: isMobile ? "left" : "inherit",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mt: 0.5,
                fontWeight: 600,
                fontSize: isMobile ? "1.75rem" : "2.125rem",
                textAlign: isMobile ? "left" : "inherit",
              }}
            >
              {value}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: "auto", textAlign: "right" }}>
          <Button
            onClick={onAction}
            sx={{
              color: actionTextColor,
              p: 0,
              fontWeight: 600,
              "&:hover": {
                background: "none",
                textDecoration: "underline",
              },
            }}
          >
            {actionText}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

StatsCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  actionText: PropTypes.string.isRequired,
  iconBgColor: PropTypes.string.isRequired,
  actionTextColor: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired,
}

export default StatsCard
