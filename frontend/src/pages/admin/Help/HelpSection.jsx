import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { ArrowRight as ArrowRightIcon } from "@mui/icons-material";

const HelpSection = ({ section, searchQuery }) => {
  const [expandedItem, setExpandedItem] = useState(null);

  const handleExpandItem = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const highlightSearchTerm = (text) => {
    if (!searchQuery) return text;

    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark
              key={i}
              style={{ backgroundColor: "yellow", padding: "0 2px" }}
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          borderLeft: `4px solid ${section.color}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          {section.icon}
          <Typography variant="h5" fontWeight="bold">
            {section.title}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {section.description}
        </Typography>

        <List sx={{ mb: 2 }}>
          {section.content.map((item, index) => (
            <Card
              key={`${section.id}-item-${index}`}
              sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemIcon sx={{ mt: 0 }}>
                    <Chip
                      label={index + 1}
                      color={section.chipColor}
                      size="small"
                      sx={{
                        borderRadius: "50%",
                        height: 28,
                        width: 28,
                        fontWeight: "bold",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="medium">
                        {highlightSearchTerm(item.text)}
                      </Typography>
                    }
                    secondary={
                      item.details && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {highlightSearchTerm(item.details)}
                        </Typography>
                      )
                    }
                  />
                </ListItem>

                {item.image && (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={`Step ${index + 1} illustration`}
                      style={{
                        maxWidth: "100%",
                        borderRadius: "8px",
                        border: "1px solid rgba(0,0,0,0.1)",
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Was this helpful?
          </Typography>
          <Box>
            <Button size="small" startIcon={<ArrowRightIcon />}>
              Learn more
            </Button>
          </Box>
        </Box>
      </Paper>

      {section.relatedTopics && (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            Related Topics | For demo purposes lang ni, might add or remove
            these in the future if necessary. But for now static pa lang ang
            data gikan sa helpData.jsx nga file. As well as ang LEARN MORE which
            can be seen at the bottom of each section or topic.
          </Typography>
          <Grid container spacing={2}>
            {section.relatedTopics.map((topic, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={topic.icon}
                  sx={{ justifyContent: "flex-start", textTransform: "none" }}
                >
                  {topic.title}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default HelpSection;
