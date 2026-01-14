// needed to set up express server
const express = require("express");
const app = express();
app.use(express.json());

// sample data for assignments
const assignments = [
  { id: 1, title: "CS assignment", completed: false },
  { id: 2, title: "Math problem set", completed: true }
];

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
    id: assignments.length + 1,
    title: title,
    completed: false
  };

  assignments.push(newAssignment);
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

    res.json(deletedAssignment);

});

// what shows up in the terminal when the server is running
app.listen(3000, () => {
  console.log("server is running");
});