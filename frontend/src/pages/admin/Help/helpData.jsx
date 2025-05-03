import {
  Email as EmailIcon,
  Speed as SpeedIcon,
  PictureAsPdf as PdfIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  BarChart as BarChartIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  VolumeUp as VolumeUpIcon,
} from "@mui/icons-material";

export const helpSections = [
  {
    id: "reviewing-letters",
    title: "Reviewing Letters",
    icon: <EmailIcon color="primary" />,
    chipColor: "primary",
    color: "#1976d2",
    description:
      "Learn how to review and process violation letters in the system.",
    content: [
      {
        text: 'Navigate to the "Violations" page from the sidebar.',
        details:
          "Click on the Violations menu item in the left sidebar to access the violations management page.",
      },
      {
        text: 'Click on a violation with the status "Under Review" to open the letter.',
        details:
          "Violations with the 'Under Review' status have letters that need your attention.",
      },
      {
        text: "Review the details of the letter and determine the appropriate action.",
        details:
          "Check all information carefully before making a decision on how to proceed.",
      },
      {
        text: 'Use the "Clear Violation" button to mark the violation as resolved.',
        details:
          "Once you've determined the appropriate action, click the Clear Violation button to update the status.",
      },
    ],
    relatedTopics: [
      { title: "Managing Violations", icon: <WarningIcon /> },
      { title: "User Notifications", icon: <EmailIcon /> },
      { title: "Violation Statuses", icon: <CheckCircleIcon /> },
    ],
  },
  {
    id: "handling-offenses",
    title: "Handling Offense Levels",
    icon: <SpeedIcon color="error" />,
    chipColor: "error",
    color: "#d32f2f",
    description:
      "Understand how different offense levels are categorized and managed in the system.",
    content: [
      {
        text: 'Speed violations above 30 km/h are flagged as "Speeding" offenses.',
        details:
          "The system automatically flags vehicles traveling above 30 km/h as speeding violations.",
      },
      {
        text: 'Noise violations above 85 dB are flagged as "Noise" offenses.',
        details:
          "Any noise level recorded above 85 decibels is automatically categorized as a noise violation.",
      },
      {
        text: 'Use the "Status Breakdown" section in the "Reports" page to monitor offense trends.',
        details:
          "The Status Breakdown section provides visual analytics on different types of offenses over time.",
      },
    ],
    relatedTopics: [
      { title: "Speed Violations", icon: <SpeedIcon /> },
      { title: "Noise Violations", icon: <VolumeUpIcon /> },
      { title: "Violation Trends", icon: <BarChartIcon /> },
    ],
  },
  {
    id: "exporting-reports",
    title: "Exporting Reports",
    icon: <PdfIcon color="success" />,
    chipColor: "success",
    color: "#2e7d32",
    description:
      "Learn how to generate and export reports for analysis and record-keeping.",
    content: [
      {
        text: 'Navigate to the "Reports" page from the sidebar.',
        details:
          "Access the Reports section to view all available reporting options.",
      },
      {
        text: "Use the filters to narrow down the data by month or search query.",
        details:
          "Apply filters to focus on specific time periods or search for particular violations.",
      },
      {
        text: 'Click the "Export" button and select your preferred format (PDF, CSV, etc.).',
        details:
          "Choose the format that best suits your needs for sharing or analyzing the data.",
      },
      {
        text: "The exported report will include all data visible in your current filtered view.",
        details:
          "Make sure to apply the appropriate filters before exporting to include only the data you need.",
      },
    ],
    relatedTopics: [
      { title: "Data Filtering", icon: <FilterListIcon /> },
      { title: "PDF Reports", icon: <PdfIcon /> },
      { title: "CSV Exports", icon: <DownloadIcon /> },
    ],
  },
  {
    id: "managing-users",
    title: "Managing Users",
    icon: <PersonIcon color="info" />,
    chipColor: "info",
    color: "#0288d1",
    description:
      "Learn how to add, edit, and manage user accounts in the system.",
    content: [
      {
        text: 'Navigate to the "Manage Users" page from the sidebar.',
        details:
          "Access the user management interface to view all registered users.",
      },
      {
        text: "Use the search bar to find specific users by name or ID.",
        details:
          "Quickly locate users by typing their name, ID, or other identifying information.",
      },
      {
        text: "Use the action menu (three dots) to edit or delete user accounts.",
        details:
          "Click the three dots icon to reveal options for managing individual user accounts.",
      },
      {
        text: "To edit a user, click the edit icon and update their information in the form.",
        details:
          "You can modify user details such as name, contact information, and account status.",
      },
      {
        text: "To delete a user, click the delete icon and confirm the action.",
        details:
          "Deleting a user is permanent, so make sure to confirm this action carefully.",
      },
    ],
    relatedTopics: [
      { title: "User Roles", icon: <PersonIcon /> },
      { title: "Account Status", icon: <CheckCircleIcon /> },
      { title: "User Permissions", icon: <VisibilityIcon /> },
    ],
  },
];
