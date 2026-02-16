import React, { useState, ChangeEvent, FormEvent } from "react";
import type { Batch, SingleDrugForm, UploadStatus } from "../../types/index.dt";
import axios from "axios";

function UploadsComponent() {
  // Tab state: 'csv' or 'single'
  const [activeTab, setActiveTab] = useState<"csv" | "single">("csv");
  // CSV file state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  // Single drug form state (including multiple batches)
  const [singleDrugForm, setSingleDrugForm] = useState<SingleDrugForm>({
    ndc: "",
    brandName: "",
    genericName: "",
    manufacturer: "",
    dosageForm: "Tablet", // default
    strength: "",
    packageSize: "",
    uom: "tablets",
    costPrice: "",
    sellingPrice: "",
    rxStatus: "Rx", // or OTC
    schedule: "", // controlled substance schedule
    storage: "",
    minStockLevel: "",
    location: "",
    batches: [{ batchNo: "", expiryDate: "", quantity: "" }], // array for multiple batches
  });
  // Upload status messages
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    type: "",
    message: "",
  });

  const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;

  // Handle CSV file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Safely check for files array using optional chaining
    const file = e.target.files?.[0];
    if (file && file.type !== "text/csv") {
      setUploadStatus({ type: "error", message: "Please select a CSV file." });
      setCsvFile(null);
    } else if (file) {
      setCsvFile(file);
      setUploadStatus({ type: "", message: "" });
    }
  };

  // Handle CSV upload
  const handleCsvUpload = () => {
    if (!csvFile) {
      setUploadStatus({ type: "error", message: "No file selected." });
      return;
    }

    console.log("Uploading CSV file:", csvFile.name);
    console.log("token is:", localStorage.getItem("token"));
    // Api call to upload CSV file
    const formData = new FormData();
    formData.append("csv_file", csvFile);
    axios
      .post(`${API_BASE_URL}/upload-csv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => console.log("Success:", res.data))
      .catch((err) => console.error("Error details:", err.response?.data));
  };

  // Download sample CSV template
  const downloadSampleCsv = () => {
    const headers = [
      "ndc",
      "brand_name",
      "generic_name",
      "manufacturer",
      "dosage_form",
      "strength",
      "package_size",
      "uom",
      "batch_no",
      "expiry_date",
      "quantity",
      "cost_price",
      "selling_price",
      "rx_status",
      "schedule",
      "storage",
      "location",
      "min_stock_level",
    ];
    const sampleRow = [
      "12345-678-90",
      "Tylenol",
      "Acetaminophen",
      "Johnson & Johnson",
      "Tablet",
      "500mg",
      "100",
      "tablets",
      "B2201A",
      "2025-12-31",
      "250",
      "5.50",
      "12.99",
      "OTC",
      "",
      "Room temperature",
      "Aisle 3",
      "50",
    ];
    const csvContent = [headers.join(","), sampleRow.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drug_upload_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle single drug form input changes (for top-level fields)
  const handleSingleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSingleDrugForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle batch array changes
  const handleBatchChange = (
    index: number,
    field: keyof Batch,
    value: string,
  ) => {
    const updatedBatches = [...singleDrugForm.batches];
    updatedBatches[index][field] = value;
    setSingleDrugForm((prev) => ({ ...prev, batches: updatedBatches }));
  };

  // Add a new batch row
  const addBatch = () => {
    setSingleDrugForm((prev) => ({
      ...prev,
      batches: [...prev.batches, { batchNo: "", expiryDate: "", quantity: "" }],
    }));
  };

  // Remove a batch row
  const removeBatch = (index: number) => {
    if (singleDrugForm.batches.length > 1) {
      const updatedBatches = singleDrugForm.batches.filter(
        (_, i) => i !== index,
      );
      setSingleDrugForm((prev) => ({ ...prev, batches: updatedBatches }));
    }
  };

  // Validate and submit single drug form
  const handleSingleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Type checking the required fields strictly against the SingleDrugForm interface
    const requiredFields: Array<keyof SingleDrugForm> = [
      "ndc",
      "brandName",
      "manufacturer",
      "strength",
      "packageSize",
      "costPrice",
      "sellingPrice",
    ];

    for (const field of requiredFields) {
      if (!singleDrugForm[field]) {
        setUploadStatus({
          type: "error",
          message: `Please fill in ${field
            .toString()
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()}.`,
        });
        return;
      }
    }

    // Validate at least one batch with required fields
    for (let i = 0; i < singleDrugForm.batches.length; i++) {
      const batch = singleDrugForm.batches[i];
      if (!batch.batchNo || !batch.expiryDate || !batch.quantity) {
        setUploadStatus({
          type: "error",
          message: `Batch #${i + 1} is missing lot number, expiry date, or quantity.`,
        });
        return;
      }
    }

    // Construct final object
    const submissionData = {
      ...singleDrugForm,
      packageSize: parseInt(singleDrugForm.packageSize as string, 10) || 0,
      costPrice: parseFloat(singleDrugForm.costPrice as string) || 0,
      sellingPrice: parseFloat(singleDrugForm.sellingPrice as string) || 0,
      minStockLevel: parseInt(singleDrugForm.minStockLevel as string, 10) || 0,
      batches: singleDrugForm.batches.map((b) => ({
        ...b,
        quantity: parseInt(b.quantity, 10) || 0,
      })),
    };

    console.log("Single drug submission:", submissionData);
    setUploadStatus({ type: "success", message: "Drug added successfully!" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Drug Uploads</h2>

      {/* Tab navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === "csv" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("csv")}
        >
          Batch Upload (CSV)
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === "single" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("single")}
        >
          Single Drug Upload
        </button>
      </div>

      {/* Status messages */}
      {uploadStatus.message && (
        <div
          className={`mb-4 p-3 rounded ${uploadStatus.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {uploadStatus.message}
        </div>
      )}

      {/* CSV Upload Tab */}
      {activeTab === "csv" && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              onClick={handleCsvUpload}
              disabled={!csvFile}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload CSV
            </button>
          </div>
          <div>
            <button
              onClick={downloadSampleCsv}
              className="text-sm text-blue-600 hover:underline"
            >
              Download Sample CSV Template
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            CSV must include headers: ndc, brand_name, generic_name,
            manufacturer, dosage_form, strength, package_size, uom, batch_no,
            expiry_date, quantity, cost_price, selling_price, rx_status,
            schedule, storage.
          </p>
        </div>
      )}

      {/* Single Drug Upload Tab */}
      {activeTab === "single" && (
        <form onSubmit={handleSingleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                NDC / SKU *
              </label>
              <input
                type="text"
                name="ndc"
                value={singleDrugForm.ndc}
                onChange={handleSingleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Brand Name *
              </label>
              <input
                type="text"
                name="brandName"
                value={singleDrugForm.brandName}
                onChange={handleSingleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Generic Name
              </label>
              <input
                type="text"
                name="genericName"
                value={singleDrugForm.genericName}
                onChange={handleSingleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Manufacturer *
              </label>
              <input
                type="text"
                name="manufacturer"
                value={singleDrugForm.manufacturer}
                onChange={handleSingleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dosage Form
              </label>
              <select
                name="dosageForm"
                value={singleDrugForm.dosageForm}
                onChange={handleSingleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option>Tablet</option>
                <option>Capsule</option>
                <option>Syrup</option>
                <option>Injection</option>
                <option>Cream</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Strength *
              </label>
              <input
                type="text"
                name="strength"
                value={singleDrugForm.strength}
                onChange={handleSingleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="e.g., 500 mg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Package Size *
              </label>
              <input
                type="number"
                name="packageSize"
                value={singleDrugForm.packageSize}
                onChange={handleSingleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unit of Measure
              </label>
              <select
                name="uom"
                value={singleDrugForm.uom}
                onChange={handleSingleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option>tablets</option>
                <option>ml</option>
                <option>grams</option>
                <option>units</option>
              </select>
            </div>
          </div>

          {/* Pricing & Reorder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cost Price *
              </label>
              <input
                type="number"
                step="0.01"
                name="costPrice"
                value={singleDrugForm.costPrice}
                onChange={handleSingleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Selling Price *
              </label>
              <input
                type="number"
                step="0.01"
                name="sellingPrice"
                value={singleDrugForm.sellingPrice}
                onChange={handleSingleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Min Stock Level
              </label>
              <input
                type="number"
                name="minStockLevel"
                value={singleDrugForm.minStockLevel}
                onChange={handleSingleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>

          {/* Regulatory & Storage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prescription Status
              </label>
              <div className="mt-1 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="rxStatus"
                    value="Rx"
                    checked={singleDrugForm.rxStatus === "Rx"}
                    onChange={handleSingleInputChange}
                    className="form-radio"
                  />{" "}
                  Rx
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="rxStatus"
                    value="OTC"
                    checked={singleDrugForm.rxStatus === "OTC"}
                    onChange={handleSingleInputChange}
                    className="form-radio"
                  />{" "}
                  OTC
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Controlled Substance Schedule
              </label>
              <select
                name="schedule"
                value={singleDrugForm.schedule}
                onChange={handleSingleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">None</option>
                <option>CII</option>
                <option>CIII</option>
                <option>CIV</option>
                <option>CV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Storage Conditions
              </label>
              <input
                type="text"
                name="storage"
                value={singleDrugForm.storage}
                onChange={handleSingleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location / Aisle
              </label>
              <input
                type="text"
                name="location"
                value={singleDrugForm.location}
                onChange={handleSingleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>

          {/* Batches Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Batches</h3>
            {singleDrugForm.batches.map((batch, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 items-end"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Lot Number *
                  </label>
                  <input
                    type="text"
                    value={batch.batchNo}
                    onChange={(e) =>
                      handleBatchChange(index, "batchNo", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={batch.expiryDate}
                    onChange={(e) =>
                      handleBatchChange(index, "expiryDate", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={batch.quantity}
                    onChange={(e) =>
                      handleBatchChange(index, "quantity", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  {index === singleDrugForm.batches.length - 1 && (
                    <button
                      type="button"
                      onClick={addBatch}
                      className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Add
                    </button>
                  )}
                  {singleDrugForm.batches.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBatch(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Drug
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UploadsComponent;
