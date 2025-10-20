import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../utils/api";
import "./FindTeams.css";

function FindTeams() {
  const [projects, setProjects] = useState([]);
  const [userId, setUserId] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        // ✅ Get logged-in user properly
        const userRes = await authFetch("/api/users/profile");
        if (!userRes.ok) throw new Error("Failed to fetch user profile");
        const userData = await userRes.json();
        const currentUserId = userData.user?._id || userData.user?.id;
        setUserId(currentUserId);

        // ✅ Get all projects
        const projectsRes = await authFetch("/api/projects");
        if (!projectsRes.ok) throw new Error("Failed to fetch projects");
        let projectsData = await projectsRes.json();

        // ✅ Filter out user's own projects
        projectsData = projectsData.filter((project) => {
          if (!project.createdBy) return true;
          const creatorId =
            typeof project.createdBy === "object"
              ? project.createdBy._id
              : project.createdBy;
          return creatorId !== currentUserId;
        });

        setProjects(projectsData);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    }

    fetchProjects();
  }, []);

  // ===============================
  // HANDLE JOIN REQUEST
  // ===============================
  const handleJoin = async (projectId) => {
    try {
      const res = await authFetch(`/api/projects/${projectId}/join`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        alert("Request sent successfully!");
        setSentRequests((prev) => [...prev, projectId]);
      } else {
        alert(data.message || "Failed to send request");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send join request");
    }
  };

  return (
    <div className="find-teams">
      <h2>Find Teams</h2>
      {projects.length === 0 ? (
        <p>No projects available to join right now.</p>
      ) : (
        <ul className="projects-list">
          {projects.map((project) => (
            <li key={project._id} className="project-card">
              <h3>{project.name || "Untitled Project"}</h3>
              <p>{project.description}</p>
              <p>
                Created by:{" "}
                {project.createdBy && project.createdBy.name
                  ? project.createdBy.name
                  : "Unknown"}
              </p>

              <div className="project-actions">
                {/* View Details */}
                <Link to={`/projects/${project._id}`}>
                  <button>View Details</button>
                </Link>

                {/* Request to Join */}
                <button
                  onClick={() => handleJoin(project._id)}
                  disabled={sentRequests.includes(project._id)}
                >
                  {sentRequests.includes(project._id)
                    ? "Already Sent"
                    : "Request to Join"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FindTeams;
  