import { Box, Tabs, Tab } from "@mui/material";

const HelpTabs = ({ sections, activeTab, handleTabChange }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="help topics tabs"
      >
        {sections.map((section, index) => (
          <Tab
            key={section.id}
            icon={section.icon}
            label={section.title}
            iconPosition="start"
            sx={{
              minHeight: 64,
              textTransform: "none",
              fontWeight: "medium",
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default HelpTabs;
