import AssignmentIcon from "@mui/icons-material/Assignment";
import SendIcon from "@mui/icons-material/Send";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EventNoteIcon from "@mui/icons-material/EventNote";
import GroupIcon from "@mui/icons-material/Group";
import BusinessIcon from "@mui/icons-material/Business";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HourglassIcon from "@mui/icons-material/HourglassTop";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import InsightsIcon from '@mui/icons-material/Insights';
import HomeIcon from '@mui/icons-material/Home';

export const navItems = [
  {
    text: "Home",
    path: "home",
    icon: <HomeIcon />,
    roles: ["ADMIN", "SUPERADMIN", "EMPLOYEE", "BDM", "TEAMLEAD", "PARTNER"],
  },
  {
    text: "Assigned",
    path: "assigned",
    icon: <AssignmentIcon />,
    roles: ["ADMIN", "EMPLOYEE", "BDM", "TEAMLEAD"],
  },
  {
    text: "Submissions",
    path: "submissions",
    icon: <SendIcon />,
    roles: ["ADMIN", "EMPLOYEE", "BDM", "TEAMLEAD","SUPERADMIN"],
  },

  {
    text: "Requirements",
    path: "requirements",
    icon: <ListAltIcon />,
    roles: [ "SUPERADMIN", "BDM", "TEAMLEAD"],
  },
  //   {
  //     text: 'Job Form',
  //     path: 'jobForm',
  //     icon: <PersonAddIcon />,
  //     roles: ['ADMIN', 'SUPERADMIN', 'BDM'],
  //   },
  {
    text: "Interviews",
    path: "interviews",
    icon: <EventNoteIcon />,
    roles: ["ADMIN", "EMPLOYEE", "BDM", "TEAMLEAD","SUPERADMIN"],
  },

  {
    text: "Users",
    path: "users",
    icon: <GroupIcon />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    text: "Team Metrices",
    path: "team-metrics",
    icon: <InsightsIcon />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    text: "Clients",
    path: "clients",
    icon: <BusinessIcon />,
    roles: [ "SUPERADMIN", "BDM", "PARTNER"],
  },
  //   {
  //     text: 'Add Client',
  //     path: 'addNewClient',
  //     icon: <PersonAddIcon />,
  //     roles: [ 'SUPERADMIN', 'BDM'],
  //   },
  // {
  //   text: "Submissions",
  //   path: "submissions-all",
  //   icon: <AssignmentTurnedInIcon />,
  //   roles: ["SUPERADMIN"],
  // },
  // {
  //   text: "Interviews",
  //   path: "interviews-all",
  //   // path: "interviews",
  //   icon: <EventNoteIcon />,
  //   roles: ["SUPERADMIN"],
  // },
  {
    text: "Placements",
    path: "placements",
    icon: <PersonAddIcon />,
    roles: ["SUPERADMIN", "PARTNER","ADMIN"],
  },
  {
    text: "Bench",
    path: "bench-users",
    icon: <HourglassIcon />,
    roles: ["ADMIN", "SUPERADMIN", "BDM", "TEAMLEAD", "PARTNER", "EMPLOYEE"],
  },
];
