import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ projects: 0, requests: 0, messages: 0 });
  const [activityFeed, setActivityFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, dashboardRes] = await Promise.all([
          authFetch("/api/users/profile"),
          authFetch("/api/dashboard"),
        ]);

        if (!profileRes.ok) throw new Error("Profile failed");
        if (!dashboardRes.ok) throw new Error("Dashboard failed");

        const profileData = await profileRes.json();
        const dashboardData = await dashboardRes.json();

        setUser(profileData.user || profileData);
        setStats(dashboardData.stats || {});

        // Merge project + activity updates into one feed
        const activities = [];

        // ✅ Recent Projects
        if (dashboardData.recentProjects?.length) {
          dashboardData.recentProjects.forEach((proj) => {
            activities.push({
              type: "project",
              message: `📁 You created project "${proj.name}"`,
              date: proj.createdAt,
            });
          });
        }

        // ✅ General Activity (if backend returns activity array)
        if (dashboardData.activity?.length) {
          dashboardData.activity.forEach((act) => {
            let msg = "";
            if (act.action?.includes("Created"))
              msg = `🆕 ${act.user?.name || "You"} created "${
                act.projectName
              }"`;
            else if (act.action?.includes("Deleted"))
              msg = `❌ ${act.user?.name || "You"} deleted "${
                act.projectName
              }"`;
            else if (act.action?.includes("Edited"))
              msg = `✏️ ${act.user?.name || "You"} updated "${
                act.projectName
              }"`;
            else if (act.action?.includes("Request"))
              msg = `📨 ${
                act.user?.name || "Someone"
              } sent a join request for "${act.projectName}"`;
            else if (act.action?.includes("Accepted"))
              msg = `✅ You accepted a join request for "${act.projectName}"`;
            else if (act.action?.includes("Rejected"))
              msg = `🚫 You rejected a join request for "${act.projectName}"`;
            else msg = `ℹ️ ${act.action || "Activity recorded"}`;

            activities.push({
              type: "activity",
              message: msg,
              date: act.createdAt,
            });
          });
        }

        // ✅ Sort newest first
        const sortedFeed = activities.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setActivityFeed(sortedFeed);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <p className="loading-text">Loading your dashboard...</p>;
  if (!user) return null;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome, {user.name} 👋</h1>
          <p className="dashboard-subtitle">
            Here's your recent activity and updates.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        {/* Active Projects */}
        <Link to="/projects" className="stat-card">
          <h2>{stats.projects}</h2>
          <p>Active Projects</p>
        </Link>

        {/* Pending Requests */}
        <Link to="/requests" className="stat-card">
          <h2>{stats.requests}</h2>
          <p>Join Requests</p>
        </Link>

        {/* Updates on Requests */}
        <Link to="/request-logs" className="stat-card">
          <h2>{stats.messages}</h2>
          <p>Request Updates</p> {/* or "Join Request Updates" */}
        </Link>
      </div>

      {/* Quick Links */}
      <div className="links-grid">
        <Link to="/profile" className="dashboard-link profile-card">
          <h3>👤 Profile</h3>
          <p>View and edit your details.</p>
        </Link>
        <Link to="/projects" className="dashboard-link projects-card">
          <h3>📂 My Projects</h3>
          <p>Manage your created or joined projects.</p>
        </Link>
        <Link to="/find-teams" className="dashboard-link teams-card">
          <h3>🤝 Find Teams</h3>
          <p>Join projects that match your interests.</p>
        </Link>
        <Link to="/requests" className="dashboard-link requests-card">
          <h3>📨 Requests</h3>
          <p>Check join requests for your projects.</p>
        </Link>
        <Link to="/create-project" className="dashboard-link create-card">
          <h3>➕ Create Project</h3>
          <p>Start a new project with your team.</p>
        </Link>
        <Link to="/current-team" className="dashboard-link current-card">
          <h3>➕ Current Teams</h3>
          <p>Check the teams you have joined.</p>
        </Link>
      </div>

      {/* Unified Recent Activity Feed */}
      <div className="activity-feed">
        <h2>📜 Recent Activity</h2>
        {activityFeed.length === 0 ? (
          <p>No activity yet. Start creating or collaborating!</p>
        ) : (
          <ul className="recent-list">
            {activityFeed.map((item, idx) => (
              <li key={idx} className="activity-item">
                <span>{item.message}</span>
                <small>{new Date(item.date).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
