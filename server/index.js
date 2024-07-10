require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { body, validationResult } = require('express-validator');
const Book = require("./models/books"); // corrected line
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  Book.find({})
    .then((books) => {
      res.json(books);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// Add route
app.route("/add")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, 'views/add_book.html'));
  })
  .post(
    [
      body("title", "Title is required").notEmpty(),
      body("author", "Author is required").notEmpty(),
      body("pages", "Pages is required").notEmpty(),
      body("ratings", "Rating is required").notEmpty(),
      body("genres", "Genre is required").notEmpty(),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let book = new Book();
      book.title = req.body.title;
      book.author = req.body.author;
      book.pages = req.body.pages;
      book.genres = req.body.genres;
      book.ratings = req.body.ratings;

      book.save()
        .then(() => {
          res.json({ message: "Successfully Added" });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: "Internal Server Error" });
        });
    }
  );

// ID search
app.route("/api/book/:id").get((req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.json({ book: book });
    })
    .catch((err) => {
      console.error("Error fetching book by id:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.route("/book/:id")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "views", "book.html"));
  })
  .delete((req, res) => {
    const query = { _id: req.params.id };

    Book.deleteOne(query)
      .then((result) => {
        if (result.deletedCount > 0) {
          res.json({ success: true, message: "Successfully Deleted" });
        } else {
          res.status(404).json({ error: "Book not found" });
        }
      })
      .catch((err) => {
        console.error("Error deleting book by id:", err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  });

// Edit book route
app.get("/edit/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "edit-book.html"));
});

app.route("/api/book/edit/:id")
  .get((req, res) => {
    Book.findById(req.params.id)
      .then((book) => {
        if (!book) {
          return res.status(404).json({ error: "Book not found" });
        }
        res.json({ book: book });
      })
      .catch((err) => {
        console.error("Error fetching book by id:", err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  })
  .post((req, res) => {
    let updatedBook = {
      title: req.body.title,
      author: req.body.author,
      pages: req.body.pages,
      genres: req.body.genres,
      ratings: req.body.ratings,
    };

    const query = { _id: req.params.id };

    Book.updateOne(query, updatedBook)
      .then(() => {
        res.json({ message: "Successfully Updated" });
      })
      .catch((err) => {
        console.error("Error updating book by id:", err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  });

mongoose.connect('mongodb+srv://n01607193:DPZP5rNGYDvOmz5p@cluster0.yxblv4f.mongodb.net/Book')
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("DB Connection Error:", err));

app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
