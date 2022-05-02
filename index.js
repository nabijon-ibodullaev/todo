const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");

mongoose
  .connect(
    "mongodb+srv://Nabijon:<password>@cluster0.k4czd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Mongodb is connected...");
  })
  .catch((err) => {
    console.log("connection error - ", err);
  });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

const PostSchema = mongoose.Schema({
  todo: {
    type: String,
    required: true,
    trim: true,
  },
});

const Posts = mongoose.model("Posts", PostSchema);

app.get("/api/posts", async (req, res) => {
  const posts = await Posts.find();
  res.send(posts);
});

app.post("/api/posts", async (req, res) => {
  let post = new Posts({
    todo: req.body.todo,
  });
  post = await post.save();
  res.status(201).send(post);
});

app.get("/api/posts/:id", async (req, res) => {
  let post = await Posts.findById(req.params.id);
  res.send(post);
});

app.delete("/api/posts/:id", async (req, res) => {
  Posts.findByIdAndRemove(req.params.id, (err, delPost) => {
    if (err) {
      console.log(err);
    } else {
      res.json(delPost);
    }
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`${port} is listening...`);
});
