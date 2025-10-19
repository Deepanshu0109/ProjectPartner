import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";
import "./CreateProject.css";

function CreateProject() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    reason: "",
    teammatesNeeded: "",
    requiredSkills: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await authFetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          requiredSkills: formData.requiredSkills.split(",").map((s) => s.trim()),
        }),
      });

      if (!res.ok) throw new Error("Failed to create project");

      navigate("/projects"); // redirect to My Projects page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="create-project-container">
      <h1>Create a New Project</h1>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="reason"
          placeholder="Reason (e.g. hackathon, academic)"
          value={formData.reason}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="teammatesNeeded"
          placeholder="Number of Teammates Needed"
          value={formData.teammatesNeeded}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="requiredSkills"
          placeholder="Skills required (comma-separated)"
          value={formData.requiredSkills}
          onChange={handleChange}
        />
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
}

export default CreateProject;
