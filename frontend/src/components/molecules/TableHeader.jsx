import { Box, Typography } from "@mui/material";
import SearchBar from "@/components/molecules/SearchBar";

const TableHeader = ({
  title,
  searchValue,
  onSearchChange,
  onRefresh,
  searchPlaceholder,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#0d1b2a" }}>
        {title}
      </Typography>

      <SearchBar
        value={searchValue}
        onChange={onSearchChange}
        onRefresh={onRefresh}
        placeholder={searchPlaceholder}
      />
    </Box>
  );
};

export default TableHeader;
