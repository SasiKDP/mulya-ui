// routeConfig.js
import Assigned from "../components/Assigned/Assigned";
import Submission from "../components/Submissions/Submission";
import Requirements from "../components/Requirements/Requirements";
import Interviews from "../components/Interviews/Interviews";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../Layout/Dashboard";
import PostRequirement from "../components/Requirements/PostRequirement/PostRequirement";
import Registration from "../components/LogIn/Registration";
import UsersList from "../components/Users/UsersList";
import ClientList from "../components/Clients/ClientList";
import OnBoardClient from "../components/Clients/OnBoardClient";
import NotFound from "../pages/NotFound/NotFound";
import Unauthorized from "../pages/Unauthorized";
import DeniedAccessCard from "../pages/NotFound/DeniedAccessCard"; 
import PlacementsList from "../components/Placements/PlacementList";
import BenchList from "../components/Bench/BenchList";
import HomePage from "../pages/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import AllInterviews from "../components/Interviews/AllInterviews";
import AllSubmissions from "../components/Submissions/AllSubmissions";


const routeConfig = [
  {
    path: "/dashboard",
    element: <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN', 'EMPLOYEE', 'BDM', 'TEAMLEAD', 'PARTNER']} />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        children: [
          {
            path: "assigned",
            element: <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN', 'EMPLOYEE', 'TEAMLEAD']} />,
            children: [{ index: true, element: <Assigned /> }]
          },
          {
            path: "submissions",
            element: <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN', 'EMPLOYEE', 'BDM', 'TEAMLEAD', 'PARTNER']} />,
            children: [{ index: true, element: <Submission /> }]
          },
          {
            path: "requirements",
            element: <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN', 'BDM', 'TEAMLEAD']} />,
            children: [{ index: true, element: <Requirements /> }]
          },
          {
            path: "jobForm",
            element: <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN', 'BDM']} />,
            children: [{ index: true, element: <PostRequirement /> }]
          },
          {
            path: "interviews",
            element: <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN', 'EMPLOYEE', 'BDM', 'TEAMLEAD']} />,
            children: [{ index: true, element: <Interviews /> }]
          },
          {
            path: "users",
            element: <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']} />,
            children: [{ index: true, element: <UsersList /> }]
          },
          {
            path: "clients",
            element: <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN', 'BDM']} />,
            children: [{ index: true, element: <ClientList /> }]
          },
          {
            path: "addNewClient",
            element: <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN', 'BDM']} />,
            children: [{ index: true, element: <OnBoardClient /> }]
          },
          {
            path: "interviews-all",
            element: <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN',]} />,
            children: [{ index: true, element: <AllInterviews /> }]
          },
          {
            path: "submissions-all",
            element: <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']} />,
            children: [{ index: true, element: <AllSubmissions /> }]
          },
          {
            path: "placements",
            element: <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN', 'BDM', 'TEAMLEAD']} />,
            children: [{ index: true, element: <PlacementsList /> }]
          },
          {
            path: "bench-users",
            element: <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN', 'BDM', 'TEAMLEAD', 'PARTNER', 'EMPLOYEE']} />,
            children: [{ index: true, element: <BenchList /> }]
          },
          {
            index: true,
            element: <HomePage />
          }
        ]
      }
    ]
  },
  {
    path: "/",
    element: <LoginPage />
  },
  {
    path: "/access",
    element: <DeniedAccessCard />
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />
  },
  {
    path: "*",
    element: <NotFound />
  }
];

export default routeConfig;
