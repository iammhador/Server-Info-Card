const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//# Middleware:
app.use(cors());
app.use(express.json());

//# MongoDB:
const { MongoClient, ServerApiVersion } = require("mongodb");
const { query } = require("express");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hilqutw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const userCollection = client.db("infocard").collection("user");
    const profileCollection = client.db("infocard").collection("profile");

    //# Registration API:
    app.get("/users", async (req, res) => {
      // const { username } = req.query;
      // const filter = username ? { username } : {};
      const filter = {};
      const result = await userCollection.find(filter).toArray();
      return res.send(result);
    });

    app.post("/registration", async (req, res) => {
      const { email, username } = req.body;
      const usernameExist = await userCollection.findOne({ username });
      const emailExist = await userCollection.findOne({ email });
      if (emailExist) {
        return res.status(400).send({ message: "Email is already registered" });
      }
      if (usernameExist) {
        return res.status(400).send({ message: "username is taken" });
      }

      const newUser = { email, username };
      const result = await userCollection.insertOne(newUser);
      return res.send(result);
    });

    //# Update Profile Information:
    app.get("/updateInformation", async (req, res) => {
      const query = {
        username: req.query.username,
      };
      const result = await profileCollection.find(query).toArray();
      return res.send(result);
    });

    //# Profile Information Post:
    app.post("/updateInformation", async (req, res) => {
      const updatedUser = req.body;
      const result = await profileCollection.insertOne(updatedUser);
      return res.send(result);
    });

    //# Edit Profile Information:
    app.put("/updateInformation", async (req, res) => {
      const username = req.query.username;
      console.log(username);
      const updatedInfo = req.body;
      console.log(updatedInfo);
      // const options = { upsert: true };
      // const updateDoc = {
      //   $set: {
      //     plot: `A harvest of random numbers, such as: ${Math.random()}`
      //   },
      // };
      // const result = await profileCollection.updateOne(filter, updateDoc, options);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

//# Starting Code:
app.get("/", function (req, res) {
  res.send("Server is working");
});

//# Console Listing Code
app.listen(port, function () {
  console.log(`listening on port ${port}`);
});
