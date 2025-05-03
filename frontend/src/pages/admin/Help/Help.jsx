import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import HelpHeader from "./HelpHeader";
import HelpTabs from "./HelpTabs";
import HelpContent from "./HelpContent";
import SearchBar from "./SearchBar";
import { helpSections } from "./helpData";

const Help = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredSections = searchQuery
    ? helpSections.map((section) => ({
        ...section,
        content: section.content.filter((item) =>
          item.text.toLowerCase().includes(searchQuery)
        ),
      }))
    : helpSections;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} role="admin" />
      <Header onToggleSidebar={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", md: `calc(100% - 240px)` },
          mt: { xs: "64px", md: "64px" },
          p: { xs: 2, sm: 3, md: 4 },
          transition: "margin 0.2s, width 0.2s",
        }}
      >
        <HelpHeader />

        <SearchBar
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
        />

        <HelpTabs
          sections={helpSections}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />

        <HelpContent
          sections={filteredSections}
          activeTab={activeTab}
          searchQuery={searchQuery}
        />
      </Box>
    </Box>
  );
};

export default Help;
