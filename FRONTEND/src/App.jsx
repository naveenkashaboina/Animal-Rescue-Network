import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/RootLayout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import AdopterProfile from "./components/AdopterProfile";
import RescuerProfile from "./components/RescuerProfile";
import RescuerAnimals from "./components/RescuerAnimals";
import PostAnimal from "./components/PostAnimal";
import EditAnimal from "./components/EditAnimal";
import AnimalByID from "./components/AnimalByID";
import AnimalRequests from "./components/AnimalRequests";
import ReportStray from "./components/ReportStray";
import StrayReports from "./components/StrayReports";
import ConvertStray from "./components/ConvertStray";
import AdminDashboard from "./components/AdminDashboard";
import AllAnimals from "./components/AllAnimals";
import ManageUsers from "./components/ManageUsers";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Unauthorized from "./components/Unauthorized";
import { Toaster } from "react-hot-toast";

function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "", element: <Home /> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },

        {
          path: "adopter-profile",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <AdopterProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "report-stray",
          element: (
            <ProtectedRoute allowedRoles={["USER"]}>
              <ReportStray />
            </ProtectedRoute>
          ),
        },

        {
          path: "rescuer-profile",
          element: (
            <ProtectedRoute allowedRoles={["RESCUER"]}>
              <RescuerProfile />
            </ProtectedRoute>
          ),
          children: [
            { index: true,              element: <RescuerAnimals /> },
            { path: "animals",          element: <RescuerAnimals /> },
            { path: "post-animal",      element: <PostAnimal /> },
            { path: "stray-reports",    element: <StrayReports /> },
            { path: "animal/:id/requests", element: <AnimalRequests /> },
          ],
        },

        {
          path: "convert-stray",
          element: (
            <ProtectedRoute allowedRoles={["RESCUER"]}>
              <ConvertStray />
            </ProtectedRoute>
          ),
        },

        { path: "animal/:id",    element: <AnimalByID /> },
        { path: "edit-animal",   element: <EditAnimal /> },
        { path: "unauthorized",  element: <Unauthorized /> },
      ],
    },
    {
      path: "/admin/dashboard",
      element: <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>,
    },
    {
      path: "/admin/animals",
      element: <AdminProtectedRoute><AllAnimals /></AdminProtectedRoute>,
    },
    {
      path: "/admin/users",
      element: <AdminProtectedRoute><ManageUsers /></AdminProtectedRoute>,
    },
  ]);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </div>
  );
}

export default App;
