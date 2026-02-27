import React, { useState, useEffect } from "react";

function SpecificPatientDetails({ patient, onUpdate }) {
  const apiUrl = import.meta.env.VITE_BASE_API_URL;
  const updateApi = `${apiUrl}/patient-update/${patient.id}`;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date_of_birth: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize form when a new patient is selected
  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || "",
        phone: patient.phone || "",
        email: patient.email || "",
        date_of_birth: patient.date_of_birth || "",
      });
      setOriginalData(patient);
      setError("");
      setSuccess("");
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(updateApi, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle validation errors
        const message = result.errors
          ? Object.values(result.errors).flat().join(", ")
          : result.message || "Update failed";
        throw new Error(message);
      }

      // Success – pass updated patient to parent
      onUpdate(result.data);
      setSuccess("Patient information updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (originalData) {
      setFormData({
        name: originalData.name || "",
        phone: originalData.phone || "",
        email: originalData.email || "",
        date_of_birth: originalData.date_of_birth || "",
      });
      setError("");
      setSuccess("");
    }
  };

  if (!patient) return null;

  return (
    <div className="patient-details">
      <h2>Patient Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date_of_birth">Date of Birth *</label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={handleReset} disabled={loading}>
            Reset
          </button>
        </div>
      </form>

      <div className="audit-info">
        <p>
          <strong>Created:</strong>{" "}
          {new Date(patient.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Last updated:</strong>{" "}
          {new Date(patient.updated_at).toLocaleString()}
        </p>
      </div>

      <style>{`
        .patient-details {
          max-width: 500px;
          margin: 0 auto;
        }
        .patient-details h2 {
          margin-top: 0;
          color: #1e2f4e;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 0.5rem;
        }
        .form-group {
          margin-bottom: 1.2rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.3rem;
          font-weight: 500;
          color: #2e405b;
        }
        .form-group input {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
          transition: border 0.2s;
        }
        .form-group input:focus {
          border-color: #2c7da0;
          outline: none;
        }
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .form-actions button {
          padding: 0.6rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .form-actions button[type="submit"] {
          background: #2c7da0;
          color: white;
        }
        .form-actions button[type="submit"]:hover:not(:disabled) {
          background: #1e5f7a;
        }
        .form-actions button[type="button"] {
          background: #e0e0e0;
          color: #1e2f4e;
        }
        .form-actions button[type="button"]:hover:not(:disabled) {
          background: #c0c0c0;
        }
        .form-actions button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .error-message {
          color: #b22222;
          background: #ffe5e5;
          padding: 0.6rem;
          border-radius: 4px;
          margin: 1rem 0;
        }
        .success-message {
          color: #2e7d32;
          background: #e8f5e9;
          padding: 0.6rem;
          border-radius: 4px;
          margin: 1rem 0;
        }
        .audit-info {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px dashed #ccc;
          font-size: 0.9rem;
          color: #5f6b7a;
        }
        .audit-info p {
          margin: 0.2rem 0;
        }
      `}</style>
    </div>
  );
}

export default SpecificPatientDetails;
