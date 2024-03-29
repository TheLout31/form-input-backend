const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const app = express();
const PORT = 3500;
const MONGO_URL =
  "mongodb+srv://imranj:imranjaleel123455@cluster0.ugwuf6d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
app.use(cors())
app.use(express.json());

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, (req, res) => {
      console.log("server running fine");
    });
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = new mongoose.Schema({
  Username: String,
  Password: String,
});

const UserModel = mongoose.model("Users", userSchema);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/userData", async (req, res) => {
  try {
    const userData = await UserModel.find();
    res.json(userData);
  } catch (err) {
    console.log(err);
  }
});

app.post("/userData", async (req, res) => {
  try {
    const { Username, Password } = req.body;
    
    const existingUser = await UserModel.findOne({Username})
    if(existingUser){
      return res.status(400).json({message:"username already exists"})
    }

    const existingPassword = await UserModel.findOne({ Password });
    if (existingPassword) {
      return res.status(400).json({ message: "Password already exists" });
    }

    const newUser = new UserModel({
      Username,
      Password,
    });

    await newUser.save();
    res.status(201).json({message:"new user created!"});

  } catch (err) {
    console.log(err);
  }
});
