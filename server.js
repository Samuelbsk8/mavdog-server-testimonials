const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

// Optional: If you plan to allow image uploads later
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// === Reviews data ===
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

// === API Endpoints ===

// Get all reviews
app.get("/api/reviews", (req, res) => {
  console.log("Fetching all reviews");
  res.json(reviews);
});

// Get single review by ID
app.get("/api/reviews/:id", (req, res) => {
  const review = reviews.find((r) => r._id === parseInt(req.params.id));
  if (review) res.json(review);
  else res.status(404).send({ message: "Review not found" });
});

// === Root Route ===
app.get("/", (req, res) => {
  res.send(`
    <h1>Mavdog K-9 API</h1>
    <p>Available endpoints:</p>
    <ul>
      <li><a href="/api/reviews">/api/reviews</a> — get all reviews</li>
      <li><a href="/api/reviews/1">/api/reviews/:id</a> — get single review by ID</li>
    </ul>
  `);
});

// === Start the server ===
app.listen(3001, () => {
  console.log("✅ Mavdog K-9 Server running on port 3001");
});
