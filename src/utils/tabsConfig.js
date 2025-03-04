import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

// Import components
import Assigned from "../components/Tabs/Assigned";
import Submissions from "../components/Tabs/Submissions";
import Interview from "../components/Tabs/Interview";
import AttendanceTracker from "../components/AttendanceTracker";
import Planned from "../components/Tabs/Planned";
import Bench from "../components/Tabs/Bench";
import AddUser from "../components/Tabs/AddUser";
import AdminDashboard from "../components/AdminDashboard";
import Requirements from "../components/Requirements/Requirements";
import JobForm from "../components/Requirements/JobForm";
import UsersList from "../components/Tabs/UsersList";
import AllSubmissions from "../components/Tabs/AllSubmissions";
import AllInterviews from "../components/Tabs/AllInterviews";
import EmployeeTimesheet from "../components/EmployeeTimesheet";

const TABS_BY_ROLE = {
  EMPLOYEE: [
    { label: "Assigned", value: "ASSIGNED", component: <Assigned />, icon: <WorkIcon /> },
    { label: "Submissions", value: "SUBMISSIONS", component: <Submissions />, icon: <AssignmentIcon /> },
    { label: "Interview", value: "INTERVIEW", component: <Interview />, icon: <GroupIcon /> },
    { label: "Timesheet", value: "TIMESHEET", component: <AttendanceTracker />, icon: <AccessTimeIcon /> },
  ],
  ADMIN: [
    { label: "Timesheet", value: "TIMESHEET", component: <AttendanceTracker />, icon: <AccessTimeIcon /> },
    { label: "Planned", value: "PLANNED", component: <Planned />, icon: <HomeIcon /> },
    { label: "Bench", value: "BENCH", component: <Bench />, icon: <PeopleIcon /> },
    { label: "Add User", value: "ADDUSER", component: <AddUser />, icon: <AddIcon /> },
  ],
  SUPERADMIN: [
    { label: "Dashboard", value: "DASHBOARD", component: <AdminDashboard />, icon: <DashboardIcon /> },
    { label: "Requirements", value: "REQUIREMENTS", component: <Requirements />, icon: <AssignmentIcon /> },
    { label: "Job Form", value: "JOB_FORM", component: <JobForm />, icon: <WorkIcon /> },
    { label: "Users", value: "USERS", component: <UsersList />, icon: <PeopleIcon /> },
    { label: "Add User", value: "ADDUSER", component: <AddUser />, icon: <AddIcon /> },
    { label: "Submissions", value: "ALLSUBMISSIONS", component: <AllSubmissions />, icon: <PersonSearchIcon /> },
    { label: "Interviews", value: "ALLINTERVIEWS", component: <AllInterviews />, icon: <InterpreterModeIcon /> },
    { label: "Bench", value: "BENCH", component: <Bench />, icon: <HourglassEmptyIcon /> },
    { label: "Timesheet", value: "TIMESHEET", component: <EmployeeTimesheet />, icon: <AccessTimeIcon /> },
  ],
  TEAMLEAD: [
    { label: "Requirements", value: "REQUIREMENTS", component: <Requirements />, icon: <AssignmentIcon /> },
    { label: "Job Form", value: "JOB_FORM", component: <JobForm />, icon: <WorkIcon /> },
    { label: "MyAssigned", value: "ASSIGNED", component: <Assigned />, icon: <WorkIcon /> },
    { label: "MySubmissions", value: "SUBMISSIONS", component: <Submissions />, icon: <AssignmentIcon /> },
    { label: "MyInterview", value: "INTERVIEW", component: <Interview />, icon: <GroupIcon /> },
    { label: "Users", value: "USERS", component: <UsersList />, icon: <PeopleIcon /> },
    { label: "Add User", value: "ADDUSER", component: <AddUser />, icon: <AddIcon /> },
    { label: "Submissions", value: "ALLSUBMISSIONS", component: <AllSubmissions />, icon: <PersonSearchIcon /> },
    { label: "Interviews", value: "ALLINTERVIEWS", component: <AllInterviews />, icon: <InterpreterModeIcon /> },
  ],
};

export default TABS_BY_ROLE;
