import { lazy } from "react";
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
import IndexPage from "../pages/IndexPage";
import ProtectedRoute from "./ProtectedRoute";
import AllInterviews from "../components/Interviews/AllInterviews";
import AllSubmissions from "../components/Submissions/AllSubmissions";
import TeamDashboard from "../components/TeamMetrics/TeamMetrices";
import TeamMetrices from "../components/TeamMetrics/TeamMetrices";
import bdmStatus from "../components/TeamMetrics/BdmStatus";
import EmployeeStatus from "../components/TeamMetrics/EmployeeStatus";
import BdmStatus from "../components/TeamMetrics/BdmStatus";


const routeConfig = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute
        allowedRoles={[
          "ADMIN",
          "SUPERADMIN",
          "EMPLOYEE",
          "BDM",
          "TEAMLEAD",
          "PARTNER",
        ]}
      />
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
        children: [
          {
            path: "home",
            element: (
              <ProtectedRoute
                allowedRoles={[
                  "ADMIN",
                  "SUPERADMIN",
                  "EMPLOYEE",
                  "BDM",
                  "TEAMLEAD",
                  "PARTNER",
                ]}
              />
            ),
            children: [{ index: true, element: <IndexPage /> }],
          },
          {
            path: "assigned",
            element: (
              <ProtectedRoute
                allowedRoles={[
                  "ADMIN",
                  "SUPERADMIN",
                  "EMPLOYEE",
                  "TEAMLEAD",
                  "BDM",
                ]}
              />
            ),
            children: [{ index: true, element: <Assigned /> }],
          },
          {
            path: "submissions",
            element: (
              <ProtectedRoute
                allowedRoles={[
                  "ADMIN",
                  "SUPERADMIN",
                  "EMPLOYEE",
                  "BDM",
                  "TEAMLEAD",
                  "PARTNER",
                ]}
              />
            ),
            children: [{ index: true, element: <Submission /> }],
          },
          {
            path: "submissions-all",
            element: <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]} />,
            children: [{ index: true, element: <AllSubmissions /> }],
          },
          {
            path: "requirements",
            element: (
              <ProtectedRoute
                allowedRoles={["ADMIN", "SUPERADMIN", "BDM", "TEAMLEAD"]}
              />
            ),
            children: [{ index: true, element: <Requirements /> }],
          },
          {
            path: "jobForm",
            element: (
              <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN", "BDM"]} />
            ),
            children: [{ index: true, element: <PostRequirement /> }],
          },
          {
            path: "interviews",
            element: (
              <ProtectedRoute
                allowedRoles={["ADMIN", "EMPLOYEE", "BDM", "TEAMLEAD"]}
              />
            ),
            children: [{ index: true, element: <Interviews /> }],
          },
          {
            path: "interviews-all",
            element: <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]} />,
            children: [{ index: true, element: <AllInterviews /> }],
          },
          {
            path: "users",
            element: <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]} />,
            children: [{ index: true, element: <UsersList /> }],
          },
          {
            path: "clients",
            element: (
              <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN", "BDM"]} />
            ),
            children: [{ index: true, element: <ClientList /> }],
          },
          {
            path: "addNewClient",
            element: (
              <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN", "BDM"]} />
            ),
            children: [{ index: true, element: <OnBoardClient /> }],
          },
          {
            path: "placements",
            element: (
              <ProtectedRoute
                allowedRoles={["ADMIN", "SUPERADMIN", "BDM", "TEAMLEAD"]}
              />
            ),
            children: [{ index: true, element: <PlacementsList /> }],
          },
          {
            path: "bench-users",
            element: (
              <ProtectedRoute
                allowedRoles={[
                  "ADMIN",
                  "SUPERADMIN",
                  "BDM",
                  "TEAMLEAD",
                  "PARTNER",
                  "EMPLOYEE",
                ]}
              />
            ),
            children: [{ index: true, element: <BenchList /> }],
          },
          {
            path: "team-metrics",
            element: (
              <ProtectedRoute
                allowedRoles={[
                  "ADMIN",
                  "SUPERADMIN",
                  "BDM",
                  "TEAMLEAD",
                  "PARTNER",
                  "EMPLOYEE",
                ]}
              />
            ),
            children: [
              {
                index: true,
                element: <TeamMetrices />,
              },
              {
                path: "bdmstatus/:employeeId",
                element: (
                  <ProtectedRoute
                    allowedRoles={["ADMIN", "SUPERADMIN", "BDM", "TEAMLEAD"]}
                  />
                ),
                children: [
                  {
                    index: true,
                    element: <BdmStatus />,
                  },
                ],
              },
              {
                path: "employeestatus/:employeeId", 
                element: (
                  <ProtectedRoute
                    allowedRoles={["ADMIN", "SUPERADMIN", "TEAMLEAD"]}
                  />
                ),
                children: [
                  {
                    index: true,
                    element: <EmployeeStatus />, // or another component if needed
                  },
                ],
              },
            ],
          },
          { index: true, element: <IndexPage /> },
        ],
      },
    ],
  },
  { path: "/", element: <LoginPage /> },
  { path: "/access", element: <DeniedAccessCard /> },
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <NotFound /> },
];

export default routeConfig;
