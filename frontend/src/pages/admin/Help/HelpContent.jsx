import { Box, Paper, Typography, Button } from "@mui/material";
import { Help as HelpIcon } from "@mui/icons-material";
import HelpSection from "./HelpSection";

const HelpContent = ({ sections, activeTab, searchQuery, setSearchQuery }) => {
  const currentSection = sections[activeTab];

  const noResults = searchQuery && currentSection.content.length === 0;

  return (
    <Box>
      {noResults ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <HelpIcon
            sx={{ fontSize: 60, color: "text.secondary", mb: 2, opacity: 0.5 }}
          />
          <Typography variant="h6" color="text.secondary">
            No results found in this section
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search terms or check other tabs.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => setSearchQuery("")}
          >
            Clear Search
          </Button>
        </Paper>
      ) : (
        <HelpSection section={currentSection} searchQuery={searchQuery} />
      )}
    </Box>
  );
};

export default HelpContent;
