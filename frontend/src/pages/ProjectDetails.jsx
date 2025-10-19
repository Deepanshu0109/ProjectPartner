import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";
import "./ProjectDetails.css";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Get current user
        const userRes = await authFetch("/api/users/profile");
        const user = await userRes.json();
        const currentUserId = user._id;
        setUserId(currentUserId);

        // Get project details
        const res = await authFetch(`/api/projects/${id}`);
        const data = await res.json();
        const proj = data.project || data;
        setProject(proj);

        // Set form data
        setFormData({
          name: proj.name || "",
          description: proj.description || "",
          reason: proj.reason || "",
          teammatesNeeded: proj.teammatesNeeded || "",
          requiredSkills: proj.requiredSkills || [],
        });

        // Check if current user already requested or is member
        if (
          proj.requests?.includes(currentUserId) ||
          proj.members?.includes(currentUserId)
        ) {
          setRequested(true);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await authFetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const updated = await res.json();
      setProject({ ...project, ...updated.project && { ...updated.project }, ...updated, createdBy: project.createdBy });
      setEditMode(false);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await authFetch(`/api/projects/${id}`, { method: "DELETE" });
      navigate("/projects");
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleJoin = async () => {
    try {
      const res = await authFetch(`/api/projects/${id}/join`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to send request");
      setRequested(true); // disable button after sending
    } catch (err) {
      console.error("Join error:", err);
      alert("Failed to send request or already sent.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found.</p>;

  const isOwner = project.createdBy?._id === userId;

  return (
    <div className="project-details-container">
      {editMode ? (
        <div className="edit-form">
          <input name="name" value={formData.name} onChange={handleChange} />
          <textarea name="description" value={formData.description} onChange={handleChange} />
          <input name="reason" value={formData.reason} onChange={handleChange} />
          <input
            name="teammatesNeeded"
            type="number"
            value={formData.teammatesNeeded}
            onChange={handleChange}
          />
          <input
            name="requiredSkills"
            value={formData.requiredSkills.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                requiredSkills: e.target.value.split(",").map((s) => s.trim()),
              })
            }
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div className="project-info">
          <h2>{project.name}</h2>
          <p>{project.description}</p>
          <p><strong>Reason:</strong> {project.reason}</p>
          <p><strong>Needed:</strong> {project.teammatesNeeded}</p>
          <p><strong>Skills:</strong> {project.requiredSkills?.join(", ")}</p>

          <div className="actions">
            {isOwner ? (
              <>
                <button onClick={() => setEditMode(true)}>Edit</button>
                <button onClick={handleDelete} className="delete-btn">Delete</button>
              </>
            ) : (
              <button onClick={handleJoin} disabled={requested}>
                {requested ? "Already Sent" : "Request to Join"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
