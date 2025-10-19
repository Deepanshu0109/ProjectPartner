import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../utils/api";
import "./MyProjects.css";

function MyProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await authFetch("/api/projects/my-projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this project?")) return;
    try {
      await authFetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  }

  return (
    <div className="my-projects-container">
      <h2 className="title">My Projects</h2>
      <ul className="projects-list">
        {projects.map((p) => (
          <li key={p._id} className="project-card">
            <Link to={`/projects/${p._id}`} className="project-link">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
            </Link>
            <div className="actions">
              <Link to={`/projects/${p._id}`}>
                <button>Edit</button>
              </Link>
              <button onClick={() => handleDelete(p._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyProjects;
