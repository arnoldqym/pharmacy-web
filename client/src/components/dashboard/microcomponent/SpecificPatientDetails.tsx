import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import type { Patient } from "../../../types/index.dt"; // adjust path if needed

interface SpecificPatientDetailsProps {
  patient: Patient | null;
  onUpdate: (updatedPatient: Patient) => void;
}

function SpecificPatientDetails({
  patient,
  onUpdate,
}: SpecificPatientDetailsProps) {
  const apiUrl = import.meta.env.VITE_BASE_API_URL;
  // patient is guaranteed non‑null after the early return, but we keep optional chaining for the URL construction
  const updateApi = `${apiUrl}/patient-update/${patient?.id}`;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date_of_birth: "",
  });
  const [originalData, setOriginalData] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
        // result may contain validation errors or a simple message
        const message = result.errors
          ? Object.values(result.errors).flat().join(", ")
          : result.message || "Update failed";
        throw new Error(message);
      }

      // Assume the API returns the updated patient inside a `data` field
      onUpdate(result.data as Patient);
      setSuccess("Patient information updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
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
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold text-[#1e2f4e] border-b-2 border-gray-200 pb-2 mb-6">
        Patient Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="text-sm font-medium text-slate-700 mb-1"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c7da0] focus:border-[#2c7da0] outline-none transition-all"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="phone"
            className="text-sm font-medium text-slate-700 mb-1"
          >
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c7da0] focus:border-[#2c7da0] outline-none transition-all"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="text-sm font-medium text-slate-700 mb-1"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c7da0] focus:border-[#2c7da0] outline-none transition-all"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="date_of_birth"
            className="text-sm font-medium text-slate-700 mb-1"
          >
            Date of Birth *
          </label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c7da0] focus:border-[#2c7da0] outline-none transition-all"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <div className="p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 text-sm text-green-800 bg-green-50 border border-green-200 rounded-md">
            {success}
          </div>
        )}

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#2c7da0] text-white font-medium rounded-lg hover:bg-[#1e5f7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="px-6 py-2.5 bg-gray-200 text-[#1e2f4e] font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="mt-8 pt-4 border-t border-dashed border-gray-300 text-sm text-slate-500 space-y-1">
        <p>
          <span className="font-bold">Created:</span>{" "}
          {new Date(patient.created_at).toLocaleString()}
        </p>
        <p>
          <span className="font-bold">Last updated:</span>{" "}
          {new Date(patient.updated_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default SpecificPatientDetails;
