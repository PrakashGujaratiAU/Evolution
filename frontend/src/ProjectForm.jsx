// ProjectForm.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ProjectForm() {
  // Router stuff
  const navigate = useNavigate();
  const { id } = useParams(); // If this exists => Edit mode, else => Create mode

  // Lock state for Project Name & Category
  const [lockedProjectFields, setLockedProjectFields] = useState(false);

  // Project name and category
  const [projectName, setProjectName] = useState("");
  const [projectCategory, setProjectCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const categoryOptions = ["History", "Technology", "Science", "Art", "Other"];

  // Slide fields
  const [title, setTitle] = useState("Abacus");
  const [year, setYear] = useState("3000 BCE");
  const [description, setDescription] = useState(
    "An ancient tool used for arithmetic calculations..."
  );
  const [type, setType] = useState("image");
  const [duration, setDuration] = useState("5000");
  const [url, setUrl] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Abacus_2.jpg/1200px-Abacus_2.jpg?20101203184045"
  );
  const [sourceUrl, setSourceUrl] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Abacus_2.jpg/1200px-Abacus_2.jpg?20101203184045"
  );
  const [slides, setSlides] = useState([]);

  // ============== Fetch existing project if ID is present (Edit Mode) ==========
  useEffect(() => {
    async function fetchProject() {
      try {
        // Example: GET /projects/:id
        const response = await axios.get(
          `http://localhost:3001/projects/${id}`
        );
        const data = response.data;
        // Populate fields
        setProjectName(data.projectName || "");
        setProjectCategory(data.projectCategory || "");
        setCustomCategory(data.customCategory || "");
        setSlides(data.slides || []);
        // If you also have partial locking logic in DB, set locked state accordingly or not
        // setLockedProjectFields( someConditionFromData );
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    }

    if (id) {
      // Edit Mode: fetch project
      fetchProject();
    } else {
      // Create Mode: can reset fields if needed
      resetFormFields();
    }
  }, [id]);

  // (Optional) If you want to keep localStorage logic for new projects, you can keep it,
  // but typically for editing an existing project, you might rely on your database instead.
  // We'll keep minimal localStorage usage here, or remove it if you prefer.

  // ========= Lock/Unlock Logic =========
  const handleLockProjectFields = () => {
    // If "Other" is selected, you might also require customCategory !== ""
    if (
      projectName.trim() !== "" &&
      projectCategory.trim() !== "" &&
      !(projectCategory === "Other" && customCategory.trim() === "")
    ) {
      setLockedProjectFields(true);
    } else {
      alert(
        "Please enter a project name and category (and custom category if 'Other') before locking."
      );
    }
  };

  const handleEditProjectFields = () => {
    setLockedProjectFields(false);
  };

  // ========= Slides Logic =========
  const handleAddSlide = () => {
    const newSlide = {
      title,
      year,
      description,
      type,
      duration,
      url,
      sourceUrl,
    };
    setSlides((prev) => [...prev, newSlide]);

    // Clear fields
    setTitle("");
    setYear("");
    setDescription("");
    setType("image");
    setDuration("");
    setUrl("");
    setSourceUrl("");
  };

  // ========= Save / Update Project to server =========
  const handleSaveProject = async () => {
    try {
      const payload = {
        projectName,
        projectCategory,
        customCategory,
        slides,
      };

      if (id) {
        // We have an ID => update existing project
        await axios.put(`http://localhost:3001/projects/${id}`, payload);
        alert("Project updated successfully!");
      } else {
        // No ID => create new project
        await axios.post("http://localhost:3001/projects", payload);
        alert("Project created successfully!");
      }

      // Optionally redirect back to ProjectList or somewhere else
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error saving project");
    }
  };

  // Helper if you want to reset all fields in create mode
  const resetFormFields = () => {
    setProjectName("");
    setProjectCategory("");
    setCustomCategory("");
    setSlides([]);
    setLockedProjectFields(false);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100 p-4">
      {/* A two-column layout that fills the entire screen. */}
      <div className="grid grid-cols-2 gap-6 h-full">
        {/* LEFT COLUMN (Form) */}
        <div className="bg-white p-4 rounded shadow flex flex-col overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4 text-center">
            {id ? "Edit Project" : "Create Project"}
          </h1>

          {/* Single Row for Project Name, Category, Lock Button */}
          <div className="flex items-end space-x-4 mb-4">
            {/* Project Name */}
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Project Name</label>
              <input
                type="text"
                value={projectName}
                disabled={lockedProjectFields}
                onChange={(e) => setProjectName(e.target.value)}
                className={`w-full border rounded px-3 py-2 ${
                  lockedProjectFields ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>

            {/* Project Category */}
            <div className="flex-1">
              <label className="block mb-1 font-semibold">
                Project Category
              </label>
              <select
                value={projectCategory}
                disabled={lockedProjectFields}
                onChange={(e) => {
                  setProjectCategory(e.target.value);
                  if (e.target.value !== "Other") {
                    setCustomCategory("");
                  }
                }}
                className={`w-full border rounded px-3 py-2 ${
                  lockedProjectFields ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <option value="">-- Select Category --</option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {projectCategory === "Other" && (
                <input
                  type="text"
                  placeholder="Enter custom category"
                  value={customCategory}
                  disabled={lockedProjectFields}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className={`w-full border rounded px-3 py-2 mt-2 ${
                    lockedProjectFields ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                />
              )}
            </div>

            {/* Lock / Edit Button */}
            <div className="pt-5">
              {!lockedProjectFields ? (
                <button
                  onClick={handleLockProjectFields}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Lock
                </button>
              ) : (
                <button
                  onClick={handleEditProjectFields}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Year */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Year</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Single Row for Type and Duration */}
          <div className="flex space-x-4 mb-4">
            {/* Type */}
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            {/* Duration */}
            <div className="flex-1">
              <label className="block mb-1 font-semibold">
                Duration (optional)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* URL */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">
              URL (file upload or link)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Source URL */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Source URL</label>
            <input
              type="text"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Add Slide & Save Project Buttons */}
          <div className="flex justify-between items-center w-full">
            <button
              onClick={handleAddSlide}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Slide
            </button>
            <button
              onClick={handleSaveProject}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {id ? "Update Project" : "Save Project"}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN (Slides Preview) */}
        <div className="bg-white p-4 rounded shadow flex flex-col overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Slides Preview
          </h1>

          {slides.length === 0 ? (
            <p>No slides added yet</p>
          ) : (
            slides.map((slide, index) => (
              <div
                key={index}
                className="flex mb-4 border-b pb-4 last:border-b-0"
                style={{ minHeight: "200px" }}
              >
                {/* Left half: image or video */}
                <div className="w-1/4 relative">
                  {slide.type === "image" ? (
                    <img
                      src={slide.url}
                      alt="Slide"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={slide.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Right half: Title (Year), description, source */}
                <div className="w-3/4 p-4 flex flex-col justify-between">
                  <h3 className="text-lg font-bold mb-2">
                    {slide.title} ({slide.year})
                  </h3>
                  <p className="mb-2 leading-relaxed">{slide.description}</p>
                  <div className="text-right text-sm text-gray-500">
                    <a href={slide.sourceUrl} target="_blank" rel="noreferrer">
                      Source
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectForm;
