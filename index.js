const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p0m1q4c.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const taskCollections = client.db("taskManagementDB").collection("task");
    // const packagesCollections = client.db("taskManagementDB").collection("packages");
    // const bookingsCollections = client.db("taskManagementDB").collection("bookings");
    // const wishListCollections = client.db("taskManagementDB").collection("wishList");

    // add task functionality
    app.post("/addTask", async (req, res) => {
      const task = req.body;
      const result = await taskCollections.insertOne(task);
      res.send(result);
    });

    app.get("/task/:email", async (req, res) => {
      const email = req.params.email;

      const query = { user: email, status: "todo" };
      const result = await taskCollections.find(query).toArray();

      res.send(result);
    });

    app.get("/taskForWarning/:email", async (req, res) => {
      const email = req.params.email;

      const query = { user: email };
      const result = await taskCollections.find(query).toArray();

      res.send(result);
    });

    app.put("/updateTask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedTask = req.body;
      const task = {
        $set: {
          title: updatedTask.title,
          description: updatedTask.description,
          user: updatedTask.user,
          priority: updatedTask.priority,
        },
      };
      const result = await taskCollections.updateOne(query, task);
      res.send(result);
    });

    app.delete("/deleteTask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollections.deleteOne(query);
      res.send(result);
    });

    app.get("/ongoingTask/:email", async (req, res) => {
      const email = req.params.email;

      const query = { user: email, status: "ongoing" };
      const result = await taskCollections.find(query).toArray();

      res.send(result);
    });

    app.get("/completedTask/:email", async (req, res) => {
      const email = req.params.email;

      const query = { user: email, status: "completed" };
      const result = await taskCollections.find(query).toArray();
      res.send(result);
    });

    app.put("/todoToOngoing/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedTask = req.body;
      const task = {
        $set: {
          status: "ongoing",
        },
      };
      const result = await taskCollections.updateOne(query, task);
      res.send(result);
    });

    app.put("/todoToCompleted/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedTask = req.body;
      const task = {
        $set: {
          status: "completed",
        },
      };
      const result = await taskCollections.updateOne(query, task);
      res.send(result);
    });

    app.put("/toTodo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedTask = req.body;
      const task = {
        $set: {
          status: "todo",
        },
      };
      const result = await taskCollections.updateOne(query, task);
      res.send(result);
    });

    // archived todo

    app.get("/archivedTodo/:email", async (req, res) => {
      const email = req.params.email;

      const query = { user: email, status: "archived" };
      const result = await taskCollections.find(query).toArray();
      console.log("result", result);
      res.send(result);
    });

    app.put("/toArchived/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const task = {
        $set: {
          status: "archived",
        },
      };
      const result = await taskCollections.updateOne(query, task);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Management");
});

app.listen(port, () => {
  console.log(`Task Management is running on port ${port}`);
});
