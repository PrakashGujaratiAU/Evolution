// ProjectForm.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const API_BASE_URL = "https://krc-evolution.vercel.app/api";
// const API_BASE_URL = "http://127.0.0.1:3001/api";

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
  const categoryOptions = [
    "Science",
    "Technology",
    "Engineering",
    "Mathematics",
    "Business",
    "Economics",
    "Medicine & Healthcare",
    "Social Sciences",
    "Humanities",
    "Education",
    "History",
    "Political Science",
    "Law & Governance",
    "Environmental Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Genetics & Biotechnology",
    "Artificial Intelligence & Machine Learning",
    "Cybersecurity & Data Science",
    "Software Development",
    "Robotics & Automation",
    "Space & Astronomy",
    "Aerospace & Aviation",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical & Electronics Engineering",
    "Energy & Sustainability",
    "Arts & Media",
    "Communication & Journalism",
    "Philosophy & Ethics",
    "Cultural Studies",
    "Linguistics & Language",
    "Psychology & Human Behavior",
    "Neuroscience",
    "Sports Science",
    "Agriculture & Food Science",
    "Fashion & Design",
    "Material Science & Nanotechnology",
    "Blockchain & Cryptocurrency",
    "Internet of Things (IoT)",
    "Renewable Energy",
    "E-Commerce & Digital Marketing",
    "Transportation & Smart Cities",
    "Cloud Computing & Big Data",
    "Virtual Reality (VR) & Augmented Reality (AR)",
    "Supply Chain & Logistics",
    "Metaverse & Digital",
    "Other",
  ];

  // Slide form fields
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("image");
  const [duration, setDuration] = useState("5000");
  const [url, setUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [slides, setSlides] = useState([]);

  // This will track which slide we're editing. Null = adding new slide
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(null);

  // ============== Fetch existing project if ID is present (Edit Mode) ==========

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
        const data = response.data;
        // Populate fields
        setProjectName(data.projectName || "");
        setProjectCategory(data.projectCategory || "");
        setCustomCategory(data.customCategory || "");
        setSlides(data.slides || []);
        // If you also have partial locking logic in DB, set lockedProjectFields based on that data if needed
        // setLockedProjectFields(data.locked ?? false);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    }

    if (id) {
      // Edit Mode: fetch project
      fetchProject();
    } else {
      // Create Mode: reset all fields
      resetFormFields();
    }
  }, [id]);

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

  // ========== Slides Logic ==========

  // 1. Add or Update Slide (depending on selectedSlideIndex)
  const handleAddOrUpdateSlide = () => {
    // If we're editing an existing slide
    if (selectedSlideIndex !== null) {
      const updatedSlides = [...slides];
      updatedSlides[selectedSlideIndex] = {
        title,
        year,
        description,
        type,
        duration,
        url,
        sourceUrl,
      };
      setSlides(updatedSlides);

      // Clear the selection & reset form
      setSelectedSlideIndex(null);
      resetSlideFields();
    } else {
      // Adding a new slide
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
      resetSlideFields();
    }
  };

  // 2. Populate the slide form for editing
  const handleEditSlide = (index) => {
    const slideToEdit = slides[index];
    setTitle(slideToEdit.title);
    setYear(slideToEdit.year);
    setDescription(slideToEdit.description);
    setType(slideToEdit.type);
    setDuration(slideToEdit.duration);
    setUrl(slideToEdit.url);
    setSourceUrl(slideToEdit.sourceUrl);

    setSelectedSlideIndex(index);
  };

  // (Optional) 3. Delete a slide
  const handleDeleteSlide = (index) => {
    const updatedSlides = slides.filter((_, i) => i !== index);
    setSlides(updatedSlides);
    // If we were editing that slide, reset to null
    if (selectedSlideIndex === index) {
      setSelectedSlideIndex(null);
      resetSlideFields();
    }
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
        await axios.put(`${API_BASE_URL}/projects/${id}`, payload);
        alert("Project updated successfully!");
      } else {
        // No ID => create new project
        await axios.post(`${API_BASE_URL}/projects`, payload);
        alert("Project created successfully!");
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error saving project");
    }
  };

  // Helper to reset the entire form (Create Mode)
  const resetFormFields = () => {
    setProjectName("");
    setProjectCategory("");
    setCustomCategory("");
    setSlides([]);
    setLockedProjectFields(false);
    resetSlideFields();
  };

  // Helper to reset the slide input fields
  const resetSlideFields = () => {
    setTitle("");
    setYear("");
    setDescription("");
    setType("image");
    setDuration("");
    setUrl("");
    setSourceUrl("");
    setSelectedSlideIndex(null);
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
              <label className="block mb-1 font-semibold">Duration (ms)</label>
              <input
                type="number"
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

          {/* Add/Update Slide & Save Project Buttons */}
          <div className="flex justify-between items-center w-full">
            <button
              onClick={handleAddOrUpdateSlide}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {selectedSlideIndex !== null ? "Update Slide" : "Add Slide"}
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
                  <div>
                    <h3 className="text-lg font-bold mb-2">
                      {slide.title} ({slide.year})
                    </h3>
                    <p className="mb-2 leading-relaxed">{slide.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <a
                      href={slide.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-500 underline"
                    >
                      Source
                    </a>
                    <div className="flex space-x-2">
                      {/* EDIT Slide */}
                      <button
                        onClick={() => handleEditSlide(index)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      {/* DELETE Slide (optional) */}
                      <button
                        onClick={() => handleDeleteSlide(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
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
