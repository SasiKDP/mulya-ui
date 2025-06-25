import { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute";
import { Box, CircularProgress, Typography } from "@mui/material";
import JobDetails from "../components/Requirements/jobTracking/JobDetails";
import InterviewsRouter from "../components/Interviews/InterviewsRouter";
import AppLayout from "../Layout/AppLayout";
import { element } from "prop-types";

const Loadable = (Component) => (
  <Suspense
    fallback={
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        gap={2}
      >
        <CircularProgress color="primary" size={40} />
        <Typography variant="subtitle1" color="textSecondary">
          Loading component...
        </Typography>
      </Box>
    }
  >
    <Component />
  </Suspense>
);

// Lazy imports
const Dashboard = lazy(() => import("../Layout/Dashboard"));
const IndexPage = lazy(() => import("../pages/IndexPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const Submission = lazy(() => import("../components/Submissions/Submission"));
const AllSubmissions = lazy(() => import("../components/Submissions/AllSubmissions"));
const Assigned = lazy(() => import("../components/Assigned/Assigned"));
const Requirements = lazy(() => import("../components/Requirements/Requirements"));
const PostRequirement = lazy(() => import("../components/Requirements/PostRequirement/PostRequirement"));
const Interviews = lazy(() => import("../components/Interviews/Interviews"));
const AllInterviews = lazy(() => import("../components/Interviews/AllInterviews"));
const UsersList = lazy(() => import("../components/Users/UsersList"));
const ClientList = lazy(() => import("../components/Clients/ClientList"));
const OnBoardClient = lazy(() => import("../components/Clients/OnBoardClient"));
const PlacementsList = lazy(() => import("../components/Placements/PlacementList"));
const BenchList = lazy(() => import("../components/Bench/BenchList"));
const TeamMetrices = lazy(() => import("../components/TeamMetrics/TeamMetrices"));
const BdmStatus = lazy(() => import("../components/TeamMetrics/BdmStatus"));
const EmployeeStatus = lazy(() => import("../components/TeamMetrics/EmployeeStatus"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));
const DeniedAccessCard = lazy(() => import("../pages/NotFound/DeniedAccessCard"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
const InProgressData=lazy(()=>import("../components/InProgress/InProgress"))

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
          "PAYROLLADMIN",
          "COORDINATOR"
        ]}
      />
    ),
    children: [
      {
        path: "",
        element: <AppLayout />,  // ← AppLayout wraps the whole dashboard section
        children: [
          {
            path: "",
            element: Loadable(Dashboard),
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
                      "PAYROLLADMIN",
                      "COORDINATOR"
                    ]}
                  />
                ),
                children: [{ index: true, element: Loadable(IndexPage) }],
              },
              {
                path: "assigned",
                element: (
                  <ProtectedRoute
                    allowedRoles={["ADMIN", "SUPERADMIN", "EMPLOYEE", "TEAMLEAD", "BDM"]}
                  />
                ),
                children: [{ index: true, element: Loadable(Assigned) }],
              },
              {
                path: "submissions",
                element: (
                  <ProtectedRoute
                    allowedRoles={["ADMIN", "SUPERADMIN", "EMPLOYEE", "BDM", "TEAMLEAD", "PARTNER"]}
                  />
                ),
                children: [{ index: true, element: Loadable(Submission) }],
              },
              {
                path: "submissions-all",
                element: <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]} />,
                children: [{ index: true, element: Loadable(AllSubmissions) }],
              },
              {
                path: "requirements",
                element: (
                  <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN", "BDM", "TEAMLEAD"]} />
                ),
                children: [
                  { index: true, element: Loadable(Requirements) },
                  {
                    path: "job-details/:jobId",
                    element: Loadable(JobDetails),
                  },
                ],
              },
              {
                path: "jobForm",
                element: <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN", "BDM"]} />,
                children: [{ index: true, element: Loadable(PostRequirement) }],
              },
              {
                path: "interviews",
                element: (
                  <ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE", "BDM", "TEAMLEAD", "SUPERADMIN","COORDINATOR"]} />
                ),
                children: [{ index: true, element: Loadable(InterviewsRouter) }],
              },
              {
                path: "interviews-all",
                element: <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]} />,
                children: [{ index: true, element: Loadable(AllInterviews) }],
              },
              {
                path: "users",
                element: <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN","COORDINATOR"]} />,
                children: [{ index: true, element: Loadable(UsersList) }],
              },
              {
                path: "clients",
                element: <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN", "BDM"]} />,
                children: [{ index: true, element: Loadable(ClientList) }],
              },
              {
                path: "addNewClient",
                element: <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN", "BDM"]} />,
                children: [{ index: true, element: Loadable(OnBoardClient) }],
              },
              {
                path: "placements",
                element: <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN", "BDM", "TEAMLEAD", "EMPLOYEE"]} />,
                children: [{ index: true, element: Loadable(PlacementsList) }],
              },
              {
                path:"InProgress",
                element:<ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN", "BDM", "TEAMLEAD", "EMPLOYEE"]} />,
                children: [{index:true,element:Loadable(InProgressData)}],
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
                children: [{ index: true, element: Loadable(BenchList) }],
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
                    element: Loadable(TeamMetrices),
                  },
                  {
                    path: "bdmstatus/:employeeId",
                    element: (
                      <ProtectedRoute
                        allowedRoles={["ADMIN", "SUPERADMIN", "BDM", "TEAMLEAD"]}
                      />
                    ),
                    children: [{ index: true, element: Loadable(BdmStatus) }],
                  },
                  {
                    path: "employeestatus/:employeeId",
                    element: (
                      <ProtectedRoute
                        allowedRoles={["ADMIN", "SUPERADMIN", "TEAMLEAD"]}
                      />
                    ),
                    children: [{ index: true, element: Loadable(EmployeeStatus) }],
                  },
                ],
              },
              { index: true, element: Loadable(IndexPage) },
            ],
          },
        ],
      },
    ],
  },
  { path: "/", element: Loadable(LoginPage) },
  { path: "/access", element: Loadable(DeniedAccessCard) },
  { path: "/unauthorized", element: Loadable(Unauthorized) },
  { path: "*", element: Loadable(NotFound) },
];

export default routeConfig;
