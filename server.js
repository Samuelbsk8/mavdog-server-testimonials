const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const path = require("path");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
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
    img_name: "images/Harra-laydown.JPG"
  },
  {
    _id: 2,
    client_name: "Sarah Miller",
    dog_name: "Ronin",
    stars: 4,
    review: "Ronin improved his recall skills a lot. Highly recommend MAVDOG K-9!",
    training_type: "Private Sessions",
    img_name: "images/ronin-sit.JPG"
  },
  {
    _id: 3,
    client_name: "Emily Johnson",
    dog_name: "Max",
    stars: 5,
    review: "The virtual consultation was amazing! I could see results immediately.",
    training_type: "Virtual Consultation",
    img_name: "images/max.jpg"
  },
  {
    _id: 4,
    client_name: "Tom Lee",
    dog_name: "Bella",
    stars: 5,
    review: "Bella's behavior has improved tremendously. The trainers really care!",
    training_type: "Boarding",
    img_name: "images/bella.jpg"
  },
  {
    _id: 5,
    client_name: "Anna White",
    dog_name: "Charlie",
    stars: 4,
    review: "Charlie learned agility skills quickly and had fun throughout!",
    training_type: "Board & Train",
    img_name: "images/charlie.jpg"
  },
  {
    _id: 6,
    client_name: "Michael Brown",
    dog_name: "Rocky",
    stars: 5,
    review: "Rocky is so much more confident now. Excellent trainers.",
    training_type: "Private Sessions",
    img_name: "images/rocky.jpg"
  },
  {
    _id: 7,
    client_name: "Laura Green",
    dog_name: "Luna",
    stars: 5,
    review: "The Board & Train program was perfect for Luna. Can't recommend enough!",
    training_type: "Board & Train",
    img_name: "images/luna.jpg"
  },
  {
    _id: 8,
    client_name: "David Kim",
    dog_name: "Scout",
    stars: 4,
    review: "Scout learned new tricks fast, trainers were super helpful and friendly.",
    training_type: "Virtual Consultation",
    img_name: "images/scout.jpg"
  }
];

app.get("/api/reviews", (req, res) => {
  res.send(reviews);
});

const validateReview = (review) => {
  const schema = Joi.object({
    client_name: Joi.string().min(2).required(),
    dog_name: Joi.string().min(2).required(),
    stars: Joi.number().min(1).max(5).required(),
    review: Joi.string().min(5).required(),
    training_type: Joi.string().min(3).required(),
    img_name: Joi.allow("")
  });

  return schema.validate(review);
};

app.post("/api/reviews", upload.single("img"), (req, res) => {
  console.log("POST request received");

  const result = validateReview(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const newReview = {
    _id: reviews.length + 1,
    client_name: req.body.client_name,
    dog_name: req.body.dog_name,
    stars: req.body.stars,
    review: req.body.review,
    training_type: req.body.training_type,
    img_name: req.file ? "images/" + req.file.filename : null

  };

  reviews.push(newReview);

  res.status(200).send(newReview);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Testimonials Server running on port ${PORT}`));
