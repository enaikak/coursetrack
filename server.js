// needed to set up express server
const express = require("express");
const app = express();
app.use(express.json());

// cors needed to allow requests from different origins
const cors = require("cors");
app.use(cors());

// needed to read and write data to a file
const fs = require("fs");
const path = require("path");

// path to the datafile
const DATA_PATH = path.join(__dirname, "data", "assignments.json");

// function to load assignments from the data file
function loadAssignments() {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}
// function to save assignments to the data file
function saveAssignments(assignments) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(assignments, null, 2));
}


// sample data for assignments
let assignments = loadAssignments();

let nextId = assignments.reduce((max, a) => Math.max(max, a.id), 0) + 1;

// req is request and res is response

// what shows up when someone visits the local host server
app.get("/", (req, res) => {
  res.json({message: "enaika's server is amazing", status: "running"});
});

// what shows up when someone visits the assignments endpoint (shows all assignments)
app.get("/assignments", (req, res) => {
    res.json(assignments);
});

// creating a new assignment
app.post("/assignments", (req, res) => {
    const title = req.body.title;

    if(!title || title.trim() === ""){
        // bad request status code 400
        return res.status(400).json({"error": "title is required"});
    }

  const newAssignment = {
    id: nextId++,
    title: title,
    completed: false
  };

  assignments.push(newAssignment);
  saveAssignments(assignments);
  // http status code 201 means created
  res.status(201).json(newAssignment);
});

// returns the assignment with a specific id number
app.get("/assignments/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const assignment = assignments.find(a => a.id === id);

  if(!assignment){
    return res.status(404).json({"error": "assignment not found"});
  }

  res.json(assignment);
})

// updates specific fields rather than updating the entire assignment
app.patch("/assignments/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const assignment = assignments.find(a => a.id === id);

    if(!assignment){
      return res.status(404).json({"error": "assignment not found"});
    }

    const { title, completed } = req.body;

    if(title === undefined && completed === undefined){
      return res.status(400).json({"error": "nothing to update"});
    }

    if(title !== undefined){
      if(typeof title !== "string" || title.trim() === ""){
        return res.status(400).json({"error": "title must be a non-empty string"});
      }
      assignment.title = title.trim();
    }

    if(completed !== undefined){
      if(typeof completed !== "boolean"){
        return res.status(400).json({"error": "completed must be a boolean"});
      }
      assignment.completed = completed;
    }
    saveAssignments(assignments);
    res.json(assignment);
});

// deletes a specific assignment from the assignments array and returns the deleted assignment
app.delete("/assignments/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = assignments.findIndex(a => a.id === id);

    if(index === -1){
        return res.status(404).json({"error": "assignment not found"});
    }
    const deletedAssignment = assignments.splice(index, 1)[0];
    saveAssignments(assignments);
    res.json(deletedAssignment);

});

// what shows up in the terminal when the server is running
app.listen(3000, () => {
  console.log("server is running");
});