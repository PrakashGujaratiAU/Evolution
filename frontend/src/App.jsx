// App.js
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import ProjectView from "./ProjectView";

function App() {
  return (
    <Router>
      <Routes>
        {/* List of all projects */}
        <Route path="/" element={<ProjectList />} />

        {/* Create a new project */}
        <Route path="/create" element={<ProjectForm />} />

        {/* View a specific project */}
        <Route path="/projects/:id/view" element={<ProjectView />} />

        {/* Edit a specific project */}
        <Route path="/projects/:id/edit" element={<ProjectForm />} />
      </Routes>
    </Router>
  );
}

export default App;
