const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://todouser:<db_password>@todocluster.j0py3jz.mongodb.net/?appName=TodoCluster";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
mongoose.connect("mongodb+srv://todouser:password@cluster0.xxxxx.mongodb.net/tododb")
.then(()=>console.log("Atlas connected"))
.catch(err=>console.log(err));


// Schema
const taskSchema = new mongoose.Schema({
  name: String,
  date: String,
  completed: Boolean
});

const Task = mongoose.model("Task", taskSchema);


// GET all tasks
app.get("/tasks", async(req,res)=>{
  const tasks = await Task.find();
  res.json(tasks);
});

// ADD task
app.post("/tasks", async(req,res)=>{
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

// UPDATE task
app.put("/tasks/:id", async(req,res)=>{
  await Task.findByIdAndUpdate(req.params.id, req.body);
  res.json({message:"Updated"});
});

// DELETE task
app.delete("/tasks/:id", async(req,res)=>{
  await Task.findByIdAndDelete(req.params.id);
  res.json({message:"Deleted"});
});

app.listen(3000, ()=> console.log("Server running on port 3000"));
