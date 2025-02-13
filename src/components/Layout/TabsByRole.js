import React from "react";

// Icons
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import AddIcon from "@mui/icons-material/Add";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

// Components
import Assigned from "../Tabs/Assigned";
import Submissions from "../Tabs/Submissions";
import Planned from "../Tabs/Planned";
import Bench from "../Tabs/Bench";
import AddUser from "../Tabs/AddUser";
import UsersList from "../Tabs/UsersList";
import AllSubmissions from "../Tabs/AllSubmissions";
import AllInterviews from "../Tabs/AllInterviews";
import Interview from "../Tabs/Interview";
import AdminDashboard from "../AdminDashboard";
import AttendanceTracker from "../AttendanceTracker";
import EmployeeTimesheet from "../EmployeeTimesheet";
import Requirements from "../Requirements/Requirements";
import JobForm from "../Requirements/JobForm";

export const TABS_BY_ROLE = {
  EMPLOYEE: [
    {
      label: "Assigned",
      value: "ASSIGNED",
      component: <Assigned />,
      icon: <WorkIcon />,
    },
    {
      label: "Submissions",
      value: "SUBMISSIONS",
      component: <Submissions />,
      icon: <AssignmentIcon />,
    },
    {
      label: "Interview",
      value: "INTERVIEW",
      component: <Interview />,
      icon: <GroupIcon />,
    },
    {
      label: "Timesheet",
      value: "TIMESHEET",
      component: <AttendanceTracker />,
      icon: <AccessTimeIcon />,
    },
  ],
  ADMIN: [
    {
      label: "Timesheet",
      value: "TIMESHEET",
      component: <AttendanceTracker />,
      icon: <AccessTimeIcon />,
    },
    {
      label: "Planned",
      value: "PLANNED",
      component: <Planned />,
      icon: <HomeIcon />,
    },
    {
      label: "Bench",
      value: "BENCH",
      component: <Bench />,
      icon: <PeopleIcon />,
    },
    {
      label: "Add User",
      value: "ADDUSER",
      component: <AddUser />,
      icon: <AddIcon />,
    },
  ],
  SUPERADMIN: [
    {
      label: "Dashboard",
      value: "DASHBOARD",
      component: <AdminDashboard />,
      icon: <DashboardIcon />,
    },
    {
      label: "Requirements",
      value: "REQUIREMENTS",
      component: <Requirements />,
      icon: <AssignmentIcon />,
    },
    {
      label: "Job Form",
      value: "JOB_FORM",
      component: <JobForm />,
      icon: <WorkIcon />,
    },
    {
      label: "Users",
      value: "USERS",
      component: <UsersList />,
      icon: <PeopleIcon />,
    },
    {
      label: "Submissions",
      value: "SUBMISSIONS",
      component: <AllSubmissions />,
      icon: <PersonSearchIcon />,
    },
    {
      label: "Interviews",
      value: "ALLINTERVIEWS",
      component: <AllInterviews />,
      icon: <InterpreterModeIcon />,
    },
    {
      label: "Bench",
      value: "BENCH",
      component: <Bench />,
      icon: <HourglassEmptyIcon />,
    },
    {
      label: "Timesheet",
      value: "TIMESHEET",
      component: <EmployeeTimesheet />,
      icon: <AccessTimeIcon />,
    },
  ],
};

export default TABS_BY_ROLE;
