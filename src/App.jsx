import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import { ApplicationProvider } from "./context/ApplicationProvider.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
import ApplicationDetails from "./pages/ApplicationDetails.jsx";
import ApplicationFormPage from "./pages/ApplicationFormPage.jsx";
import Applications from "./pages/Applications.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ExploreJobs from "./pages/ExploreJobs.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ApplicationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* ProtectedRoute checks for a user, Layout adds the navbar. */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applications/new" element={<ApplicationFormPage />} />
                <Route path="/applications/:id" element={<ApplicationDetails />} />
                <Route
                  path="/applications/:id/edit"
                  element={<ApplicationFormPage />}
                />
                <Route path="/explore-jobs" element={<ExploreJobs />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </ApplicationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
