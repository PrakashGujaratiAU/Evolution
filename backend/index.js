// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://prakashgujarati:CEg2utxS6kuxRNYH@cluster0.8cjw3hn.mongodb.net/krc_evolution"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/**
 * Slide Schema (Subdocument Schema)
 * - Each project can have many slides, each with these fields.
 */
const slideSchema = new mongoose.Schema({
  title: String,
  year: String,
  description: String,
  type: String,
  duration: String,
  url: String,
  sourceUrl: String,
});

/**
 * Project Schema
 * - Embeds an array of slides (subdocuments) defined by slideSchema
 */
const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  projectCategory: {
    type: String,
    required: true,
  },
  customCategory: {
    type: String,
  },
  slides: [slideSchema], // array of Slide subdocuments
});

// Create the Mongoose model
const Project = mongoose.model("Projects", projectSchema);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// =========== CREATE a new project =============
app.post("/projects", async (req, res) => {
  try {
    // req.body should contain { projectName, projectCategory, customCategory, slides: [] }
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// =========== READ (list) all projects ==========
app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find({});
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// =========== READ one project by ID ============
app.get("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// =========== UPDATE project by ID ==============
app.put("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // req.body might include updated slides, etc.
    const updatedProject = await Project.findByIdAndUpdate(id, req.body, {
      new: true, // return the updated document
    });
    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// =========== DELETE project by ID ==============
app.delete("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start Server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
