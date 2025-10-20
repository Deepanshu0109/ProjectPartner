import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateProject from "./pages/CreateProject";
import MyProjects from "./pages/MyProjects";
import ProjectDetails from "./pages/ProjectDetails";
import FindTeams from "./pages/FindTeams";
import Requests from "./pages/Requests";
import Activity from "./pages/RequestLogs";
import CurrentTeams from "./pages/CurrentTeams";
import ProjectChat from "./pages/ProjectChat";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Landing />}
        />
        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Register setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/" />}
        />
        <Route
          path="/create-project"
          element={isLoggedIn ? <CreateProject /> : <Navigate to="/login" />}
        />
        <Route
          path="/projects"
          element={isLoggedIn ? <MyProjects /> : <Navigate to="/login" />}
        />
        <Route
          path="/projects/:id"
          element={isLoggedIn ? <ProjectDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/find-teams"
          element={isLoggedIn ? <FindTeams /> : <Navigate to="/login" />}
        />
        <Route
          path="/requests"
          element={isLoggedIn ? <Requests /> : <Navigate to="/login" />}
        />
        <Route
          path="/request-logs"
          element={isLoggedIn ? <Activity /> : <Navigate to="/login" />}
        />
        
        <Route
          path="/current-teams"
          element={isLoggedIn ? <CurrentTeams /> : <Navigate to="/login" />}
        />

        <Route
          path="/projects/:id/chat"
          element={isLoggedIn ? <ProjectChat /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
    </Router>
  );
}

export default App;
