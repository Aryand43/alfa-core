import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectRunsPage from "./pages/ProjectRunsPage";
import LabsPage from "./pages/LabsPage";
import LabRunsPage from "./pages/LabRunsPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { loggedIn } = useAuth();
  return loggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/projects"
              element={<PrivateRoute><ProjectsPage /></PrivateRoute>}
            />
            <Route
              path="/projects/:projectId"
              element={<PrivateRoute><ProjectRunsPage /></PrivateRoute>}
            />
            <Route
              path="/labs"
              element={<PrivateRoute><LabsPage /></PrivateRoute>}
            />
            <Route
              path="/labs/:labId"
              element={<PrivateRoute><LabRunsPage /></PrivateRoute>}
            />
            <Route path="*" element={<Navigate to="/projects" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
