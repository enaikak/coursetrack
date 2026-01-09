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

// what shows up on when someone visits the local host server
app.get("/", (req, res) => {
  res.json({message: "enaika's server is amazing", status: "running"});
});

// what shows up when someone visits the assignments endpoint (shows all assignments)
app.get("/assignments", (req, res) => {res.json(assignments);})

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

// updating an existing assignment's completed status
app.put("/assignments/:id", (req, res) => {
    // have to use parseInt bc req.params.id is a string
    const id = parseInt(req.params.id);
    const assignment = assignments.find( a => a.id === id );

    if(!assignment){
        // not found status code 404
        return res.status(404).json({"error": "assignment not found"});
    }
    // update the completed status and returning the updated assignment
    assignment.completed = req.body.completed;
    res.json(assignment);
});

// what shows up in the terminal when the server is running
app.listen(3000, () => {
  console.log("server is running");
});