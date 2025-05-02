import { Tabs, Tab } from "@mui/material";
import {
  TableChart as TableChartIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";

const ViewModeTabs = ({ value, onChange }) => {
  return (
    <Tabs value={value} onChange={onChange} sx={{ minHeight: 40 }}>
      <Tab
        value="table"
        icon={<TableChartIcon fontSize="small" />}
        label="Table"
        sx={{ minHeight: 40, textTransform: "none" }}
      />
      <Tab
        value="chart"
        icon={<BarChartIcon fontSize="small" />}
        label="Charts"
        sx={{ minHeight: 40, textTransform: "none" }}
      />
    </Tabs>
  );
};

export default ViewModeTabs;
