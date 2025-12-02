const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const imagesDir = path.join(__dirname, "public", "images");
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

let reviews = [
  {
    _id: 1,
    client_name: "Jason Britton",
    dog_name: "Harra",
    stars: 5,
    review: "Harra learned basic obedience so quickly! The trainers were patient and professional.",
    training_type: "Board & Train",
    img_name: "images/Harra-laydown.JPG",
  },
  {
    _id: 2,
    client_name: "Sarah Miller",
    dog_name: "Ronin",
    stars: 4,
    review: "Ronin improved his recall skills a lot. Highly recommend MAVDOG K-9!",
    training_type: "Private Sessions",
    img_name: "images/ronin-sit.JPG",
  },
];

const validateReview = (rev) => {
  const schema = Joi.object({
    client_name: Joi.string().min(2).required(),
    dog_name: Joi.string().min(1).required(),
    stars: Joi.number().min(1).max(5).required(),
    review: Joi.string().min(5).required(),
    training_type: Joi.string().min(3).required(),
    img_name: Joi.any().optional(),
  });
  return schema.validate(rev);
};

app.get("/api/reviews", (req, res) => {
  res.json(reviews);
});

app.get("/api/reviews/:id", (req, res) => {
  const r = reviews.find((x) => x._id === parseInt(req.params.id));
  if (!r) return res.status(404).send("Review not found");
  res.json(r);
});

app.post("/api/reviews", upload.single("img"), (req, res) => {
  const objForValidation = {
    client_name: req.body.client_name,
    dog_name: req.body.dog_name,
    stars: req.body.stars ? parseInt(req.body.stars) : undefined,
    review: req.body.review,
    training_type: req.body.training_type,
  };
  const result = validateReview(objForValidation);
  if (result.error) return res.status(400).send(result.error.details[0].message);

  const newReview = {
    _id: reviews.length ? reviews[reviews.length - 1]._id + 1 : 1,
    client_name: objForValidation.client_name,
    dog_name: objForValidation.dog_name,
    stars: objForValidation.stars,
    review: objForValidation.review,
    training_type: objForValidation.training_type,
    img_name: req.file ? `images/${req.file.filename}` : null,
  };

  reviews.push(newReview);
  res.status(200).json(newReview);
});

app.put("/api/reviews/:id", upload.single("img"), (req, res) => {
  const review = reviews.find((x) => x._id === parseInt(req.params.id));
  if (!review) return res.status(404).send("Review not found");

  const objForValidation = {
    client_name: req.body.client_name,
    dog_name: req.body.dog_name,
    stars: req.body.stars ? parseInt(req.body.stars) : undefined,
    review: req.body.review,
    training_type: req.body.training_type,
  };
  const result = validateReview(objForValidation);
  if (result.error) return res.status(400).send(result.error.details[0].message);

  review.client_name = objForValidation.client_name;
  review.dog_name = objForValidation.dog_name;
  review.stars = objForValidation.stars;
  review.review = objForValidation.review;
  review.training_type = objForValidation.training_type;
  if (req.file) review.img_name = `images/${req.file.filename}`;

  res.status(200).json(review);
});

app.delete("/api/reviews/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const idx = reviews.findIndex((r) => r._id === id);
  if (idx === -1) return res.status(404).send("Review not found");
  const removed = reviews.splice(idx, 1)[0];
  res.status(200).json(removed);
});

app.get("/", (req, res) => {
  res.send(`
    <h1>Mavdog Testimonials API</h1>
    <p><a href="/api/reviews">/api/reviews</a></p>
  `);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Testimonials Server running on port ${PORT}`));
