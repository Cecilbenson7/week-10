let mongoose = require("mongoose");

let bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
    genres: {
      type: [String],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    created_by: {
      type: String,
      required: true,
    }
  },
);

let Book = (module.exports = mongoose.model("book", bookSchema));
