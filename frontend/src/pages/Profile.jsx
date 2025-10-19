import { useState, useEffect } from "react";
import { authFetch } from "../utils/api";
import "./Profile.css";

function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    semester: "",
    rollNo: "",
    skills: "",
    interests: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authFetch("/api/users/profile");
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        const user = data.user;
        setFormData({
          name: user.name || "",
          email: user.email || "",
          specialization: user.specialization || "",
          semester: user.semester || "",
          rollNo: user.rollNo || "",
          skills: (user.skills || []).join(", "),
          interests: (user.interests || []).join(", "),
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setMessage("Failed to load profile. Please log in again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(",").map((s) => s.trim()),
          interests: formData.interests.split(",").map((i) => i.trim()),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Update failed");
      }

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  if (loading) return <p className="loading-text">Loading profile...</p>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      {message && <p className="success-message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            disabled
            placeholder=" "
          />
          <label>Name</label>
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            placeholder=" "
          />
          <label>Email</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="rollNo"
            value={formData.rollNo}
            onChange ={handleChange}
            placeholder=" "
          />
          <label>Roll Number</label>
        </div>
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Specialization"
            />
            <label>Specialization</label>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              placeholder="Semester"
            />
            <label>Semester</label>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Skills (comma separated)"
            />
            <label>Skills</label>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="Interests (comma separated)"
            />
            <label>Interests</label>
          </div>
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default Profile;
