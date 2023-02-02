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
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cqqhz9d.mongodb.net/?retryWrites=true&w=majority`;

//# MongoDB Client:
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
});

async function run() {
  try {
    const userCollection = client.db("infocard").collection("user");
    // const userInfo = {
    //   username: "iammhador",
    //   email: "iammhador@gmail.com",
    //   password: "iammhador",
    // };
    // const result = await userCollection.insertOne(userInfo);
    // res.send(result);
    // console.log(result);

    app.get("/users", async (req, res) => {
      const result = await userCollection.find({}).toArray();
      res.send(result);
    });
  } finally {
  }
}
console.log(uri);
run().catch((err) => console.log(err));

//# Starting Code:
app.get("/", function (req, res) {
  res.send("Server is working");
});

//# Console Listing Code
app.listen(port, function () {
  console.log(`listening on port ${port}`);
});
