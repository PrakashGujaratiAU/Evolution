// testInsert.js
const mongoose = require("mongoose");

// 1. Connect to MongoDB mongodb+srv://prakashgujarati:CEg2utxS6kuxRNYH@cluster0.8cjw3hn.mongodb.net/krc_evolution
mongoose
  .connect(
    "mongodb+srv://prakashgujarati:CEg2utxS6kuxRNYH@cluster0.8cjw3hn.mongodb.net/krc_evolution",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB successfully."))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// 2. Define the sub-schema for slides
const SlideSchema = new mongoose.Schema(
  {
    title: String,
    year: String,
    description: String,
    type: String,
    duration: String,
    url: String,
    sourceUrl: String,
  },
  { _id: false } // _id: false makes slides subdocuments not have their own ObjectId
);

// 3. Define the main Project schema using the slides sub-schema
const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  slides: {
    type: [SlideSchema], // use the sub-schema as an array
    default: [],
  },
});

// 4. Create the single Model
const Project = mongoose.model("Project", ProjectSchema, "projects");

// 5. Insert a test record
async function insertTestRecord() {
  try {
    const insertedProject = await Project.create({
      projectName: "SimpleTestProject",
      slides: [
        {
          title: "Sample Slide Title",
          year: "2023 CE",
          description: "A short description about this test slide.",
          type: "Example Type",
          duration: "Short",
          url: "https://example.com/test-slide",
          sourceUrl: "https://source.example.com/test-slide",
        },
      ],
    });

    console.log("Inserted record:", insertedProject);
  } catch (error) {
    console.error("Error inserting test record:", error);
  } finally {
    // 6. Close the connection
    mongoose.connection.close();
  }
}

insertTestRecord();
