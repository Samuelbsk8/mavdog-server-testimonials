const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Joi = require("joi");
const multer = require("multer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

const upload = multer();

const Testimonial = mongoose.model(
  "Testimonial",
  new mongoose.Schema({
    client_name: String,
    dog_name: String,
    stars: Number,
    review: String,
    training_type: String,
    img: String,
  })
);

const reviewSchema = Joi.object({
  client_name: Joi.string().min(2).required(),
  dog_name: Joi.string().min(1).required(),
  stars: Joi.number().min(1).max(5).required(),
  review: Joi.string().min(5).required(),
  training_type: Joi.string().required(),
});

app.get("/api/reviews", async (req, res) => {
  const reviews = await Testimonial.find().sort({ _id: -1 });
  res.json(reviews);
});

app.post("/api/reviews", upload.single("img"), async (req, res) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let imgString = null;
  if (req.file) {
    imgString = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;
  }

  const review = new Testimonial({
    ...req.body,
    img: imgString,
  });

  const saved = await review.save();
  res.json(saved);
});

app.put("/api/reviews/:id", upload.single("img"), async (req, res) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let imgString = undefined;
  if (req.file) {
    imgString = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;
  }

  const updated = await Testimonial.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      ...(imgString ? { img: imgString } : {}),
    },
    { new: true }
  );

  res.json(updated);
});

app.delete("/api/reviews/:id", async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
