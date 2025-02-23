import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
/**
 * ProjectList
 * - Fetches all projects from `GET /projects`
 * - Adds new projects via `POST /projects`
 * - Filters list by search query
 * - Voice input for search
 */
const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Setup SpeechRecognition on mount
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };
    } else {
      console.warn("Speech Recognition not supported in this browser.");
    }
  }, []);

  // Filter whenever searchQuery or projects change
  useEffect(() => {
    const lowerSearch = searchQuery.toLowerCase();
    const results = projects.filter(
      (p) =>
        p.projectName.toLowerCase().includes(lowerSearch) ||
        (p.projectCategory || "").toLowerCase().includes(lowerSearch)
    );
    setFilteredProjects(results);
  }, [searchQuery, projects]);

  // GET /projects
  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:3001/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // POST /projects (simple example for demonstration)
  const handleAddProject = async () => {
    // For demonstration, let's auto-generate a new project
    const newProject = {
      projectName: "New Project " + (projects.length + 1),
      projectCategory: "Test Category",
      slides: [], // empty slides as a placeholder
    };

    try {
      const response = await fetch("http://localhost:3001/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      if (response.ok) {
        // Re-fetch the list to see the newly added project
        await fetchProjects();
      } else {
        console.error("Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  // Mic button click handler
  const handleMicClick = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      alert("Speech Recognition not supported in this browser.");
    }
  };

  // For demonstration: Navigate to the project edit form
  const handleEditProject = (projId) => {
    // Instead of alert, navigate to "/projects/:id/edit"
    navigate(`/projects/${projId}/edit`);
  };

  const handleViewProject = (projId) => {
    // alert(`View project with ID = ${projId}`);
    navigate(`/projects/${projId}/view`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header / Top bar */}
      <div className="flex items-center p-4 bg-white shadow-sm">
        {/* Hamburger icon (left) */}
        <button
          className="px-2 focus:outline-none"
          onClick={() => alert("Menu clicked!")}
        >
          {/* Simple bars icon */}
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Search + mic */}
        <div className="relative flex-1 ml-2">
          <input
            type="text"
            placeholder="Search Project"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md w-full px-4 py-2"
          />
          {/* Mic button (absolute right) */}
          <button
            className="absolute right-2 top-2 text-gray-600 hover:text-gray-900"
            onClick={handleMicClick}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9 2a3 3 0 0 1 3 3v4a3 3 0 1 1-6 0V5a3 3 0 0 1 3-3z"></path>
              <path
                fillRule="evenodd"
                d="M5 9a.75.75 0 0 1 1.5 0v1A3.5 3.5 0 0 0 10 13.5h0A3.5 3.5 0 0 0 13.5 10V9a.75.75 0 0 1 1.5 0v1A5 5 0 0 1 10 15h0a5 5 0 0 1-5-5V9z"
                clipRule="evenodd"
              ></path>
              <path d="M9.25 17a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5z"></path>
            </svg>
          </button>
        </div>

        {/* Add button (right) */}
        <button
          className="ml-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
          onClick={handleAddProject}
        >
          Add
        </button>
      </div>

      {/* PROJECTS TABLE */}
      <div className="p-8 w-1/2 mx-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left font-semibold text-gray-600">
                Title
              </th>
              {/* Add text-right here */}
              <th className="px-12 py-2 text-right font-semibold text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((proj) => (
              <tr
                key={proj._id || proj.id}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >
                {/* Project Name & Category */}
                <td className="px-4 py-3">
                  <div className="font-semibold text-gray-800">
                    {proj.projectName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {proj.projectCategory || "No Category"}
                    {/* || Slides Count: {proj.slides.length} */}
                  </div>
                </td>

                {/* Actions: View / Edit */}
                {/* Add text-right here as well */}
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleViewProject(proj._id || proj.id)}
                    className="border border-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEditProject(proj._id || proj.id)}
                    className="border border-green-500 text-green-500 px-3 py-1 rounded hover:bg-green-500 hover:text-white transition-colors ml-2"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {/* If no results */}
            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-3 text-center text-gray-500">
                  No matching projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer (View More) */}
        <footer className="fixed bottom-0 left-0 w-full bg-gray-200 py-2 text-center">
          <span className="text-sm text-gray-700">
            © 2025 Atmiya University - KRC
          </span>
        </footer>
        {/* <div className="mt-2 text-right">
          <button
            onClick={() => alert("View More Projects")}
            className="text-blue-600 hover:underline"
          >
            View More
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ProjectList;
