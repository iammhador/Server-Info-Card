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
const uri = `mongodb+srv://InfoCard:${process.env.DB_PASS}>@cluster0.hilqutw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const userCollection = client.db("infocard").collection("user");
    //Registrattion API
    app.post("/registration", async (req, res) => {
      try {
        const { email, username } = req.body;
        const userExist = await userCollection.findOne({
          $or: [{ email }, { username }],
        });
        if (userExist) {
          return res.status(400).send({
            message: userExist.email
              ? "Email address is already registered"
              : "username is taken",
          });
        }

        const newUser = { email, username };
        const result = await userCollection.insertOne(newUser);
        return res.send(result);
      } catch (error) {
        return res
          .status(500)
          .send({ message: "An error occurred while registering try again" });
      }
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
